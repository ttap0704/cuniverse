# 프로젝트명
[Cuniverse](https://cu-niverse.com) (NFT Market Place)

# 소개
메타마스크를 통해 Web3 지갑을 웹 사이트와 연동하여 <br/>
NFT 컬렉션 배포/민팅, 개인간 NFT 거래가 가능한 NFT Market Place 입니다. <br/>
(해당 프로젝트는 Ethereum Sepolia Network 환경에서 실행됩니다.)

# 주요 기능
### ERC-721 (NFT) 스마트 콘트랙트 배포
```solidity
// openzeppelin 라이브러리를 사용하여 ERC-721 표준에 맞게 Contract를 설계하였습니다.

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.1;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Royalty.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

// 창작자 Royalty를 할당할 수 있도록 ERC721Royalty Option을 선택하였습니다.
contract NFT is ERC721Royalty {
  using Counters for Counters.Counter;

  Counters.Counter private currentTokenId;

  string public baseTokenURI;
  mapping(uint256 => string) private metadataHash;

  // 배포할 시, constructor를 통해 기본적인 name, symbol 그리고 royalty 비율을 설정할 수 있습니다.
  constructor(string memory _name, string memory _symbol, uint96 _feeNumerator) ERC721(_name, _symbol) {
    baseTokenURI = 'https://ipfs.io/ipfs/';
    _setDefaultRoyalty(msg.sender, _feeNumerator);
  }

  function mintTo(address recipient, string memory hashString) public returns (uint256) {
    currentTokenId.increment();
    uint256 newItemId = currentTokenId.current();

    // IPFS CID를 tokenId와 매핑
    metadataHash[newItemId] = hashString;
    _safeMint(recipient, newItemId);
    return newItemId;
  }

  function _baseURI() internal view virtual override returns (string memory) {
    return baseTokenURI;
  }

  function setBaseTokenURI(string memory _baseTokenURI) public {
    baseTokenURI = _baseTokenURI;
  }

  function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
      _requireMinted(tokenId);

      string memory baseURI = _baseURI();
      string memory tokenMetadataHash = metadataHash[tokenId];
      return bytes(baseURI).length > 0 ? string(abi.encodePacked(baseURI, tokenMetadataHash)) : "";
  }
}
```

### IPFS를 통해 이미지 및 메타데이터 업로드 (infura.io API)
```javascript
// IPFS API KEY/SECRET
const projectId = process.env.INFURA_IPFS_KEY;
const projectSecret = process.env.INFURA_IPFS_KEY_SECRET;
const auth = `Basic ${Buffer.from(
  `${projectId}:${projectSecret}`
).toString("base64")}`;
const headers = new Headers();
headers.append("Authorization", auth);

// Upload Form Data
const formdata = new FormData();
if (uploadData) formdata.append("file", uploadData);

const requestOptions = {
  method: "POST",
  headers,
  body: formdata,
};

// IPFS 파일 업로드 요청
const requestURI = "https://ipfs.infura.io:5001/api/v0/add";
const response = await fetch(requestURI, requestOptions);
const responseJson = await response.json();
```

### 직접 설계한 NFT 거래 콘트랙트를 통해, 개인간 NFT 거래 ([Cuniverse Hub](https://sepolia.etherscan.io/address/0x41aae050DdCDf5894099B9d56d863a201Dc09807))
```solidity
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "./interfaces/ICuniverseHub.sol";

import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/utils/introspection/ERC165Checker.sol";

import "@openzeppelin/contracts/access/Ownable.sol";

import "@openzeppelin/contracts/interfaces/IERC2981.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import "@openzeppelin/contracts/token/common/ERC2981.sol";
import "@openzeppelin/contracts/interfaces/IERC2981.sol";

contract CuniverseHub is ICuniverseHub, Ownable {
  struct FeeInfo {
    address payable receiver;
    uint96 feeFraction;
  }

  fallback() external payable {}

  receive() external payable {}

  using Address for address;
  using SafeMath for uint256;
  using ERC165Checker for address;

  FeeInfo private _feeInfo;
  mapping(address => uint256) _approvedBalances;

  bytes4 private constant ERC2981_INTERFACE_ID = type(IERC2981).interfaceId;
  bytes4 private constant ERC721_INTERFACE_ID = type(IERC721).interfaceId;

  bytes32 public DOMAIN_SEPARATOR;
  bytes32 private constant ORDER_TYPEHASH =
    keccak256(
      "Order(address owner,address contractAddress,uint256 tokenId,uint256 price,uint256 startTime,uint256 endTime)"
    );

  // bytes4 private constant ERC1155_INTERFACE_ID = type(IERC1155).interfaceId;

  constructor(address payable receiver_, uint96 feeFraction_) {
    setFeeInfo(receiver_, feeFraction_);

    // EIP-712 서명 DOMAIN_SEPARATOR 설정
    DOMAIN_SEPARATOR = keccak256(
      abi.encode(
        keccak256(
          "EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)"
        ),
        keccak256(bytes("Cuniverse")),
        keccak256(bytes("1.0")),
        block.chainid,
        address(this)
      )
    );
  }

  function setFeeInfo(address payable _receiver, uint96 _feeFraction)
    public
    override
    onlyOwner
  {
    _setFeeInfo(_receiver, _feeFraction);
  }

  function _setFeeInfo(address payable _receiver, uint96 _feeFraction)
    internal
  {
    _feeInfo = FeeInfo(_receiver, _feeFraction);
  }

  // 실제 거래가 이루어지는 Method
  function proceedOrder(
    address _owner,
    address _contractAddress,
    uint256 _tokenId,
    uint256 _price,
    uint256 _startTime,
    uint256 _endTime,
    uint8 v,
    bytes32 r,
    bytes32 s
  ) public payable {
    // Order Struct
    Order memory order = Order(
      _owner,
      _contractAddress,
      _tokenId,
      _price,
      _startTime,
      _endTime
    );

    require(
      _verifyOrder(_owner, order, v, r, s),
      "CuniverseHub: invaild order"
    );

    require(msg.value == _price, "CuniverseHub: msg.value came in wrong");

    require(msg.sender != _owner, "CuniverseHub: can not buy owned token");

    require(
      !Address.isContract(msg.sender),
      "CuniverseHub: msg.sender is not wallet address"
    );

    require(
      _checkStartTime(_startTime),
      "CuniverseHub: it is not time for sale yet"
    );

    require(_checkEndTime(_endTime), "CuniverseHub: this sale has ended");

    require(
      _isERC721(_contractAddress),
      "CuniverseHub: not supported contract"
    );

    require(
      _isOwner(_owner, _contractAddress, _tokenId),
      "CuniverseHub: owner does not have this token"
    );

    require(
      _checkApproval(_owner, _contractAddress),
      "CuniverseHub: no approval for transfer"
    );

    // 모든 검증 과정을 마친 후
    // 창작자 로열티, 플랫폼 수수료, 최종 금액 계산
    uint256 feeAmount = _getFeeAmount(_price);
    (address creatorAddress, uint256 creatorAmount) = _calculationCreatorFee(
      _contractAddress,
      _tokenId,
      _price
    );
    uint256 totalEarning = _totalEarning(_price, feeAmount, creatorAmount);

    // 최종 금액 및 수수료/로열티 전송
    _sendAmount(_feeInfo.receiver, feeAmount);
    _sendAmount(_owner, totalEarning);
    if (creatorAddress != address(0) && creatorAmount != 0) {
      _sendAmount(creatorAddress, creatorAmount);
    }

    // ERC-721 transferFrom Method 실행
    _transferFrom(_owner, _contractAddress, _tokenId);
  }

  function _transferFrom(
    address _owner,
    address _contractAddress,
    uint256 _tokenId
  ) internal {
    IERC721 currentERC721 = IERC721(_contractAddress);

    currentERC721.safeTransferFrom(_owner, msg.sender, _tokenId);
    emit Transfer(_owner, msg.sender, _tokenId);
  }

  // Order Struct hash
  function _hashOrder(Order memory _order) public view returns (bytes32) {
    return
      keccak256(
        abi.encodePacked(
          "\x19\x01",
          DOMAIN_SEPARATOR,
          keccak256(
            abi.encode(
              ORDER_TYPEHASH,
              _order.owner,
              _order.contractAddress,
              _order.tokenId,
              _order.price,
              _order.startTime,
              _order.endTime
            )
          )
        )
      );
  }

  function _sendAmount(address _receiver, uint256 _balance) internal {
    payable(_receiver).transfer(_balance);
  }

  function _getFeeAmount(uint256 _price) internal view returns (uint256) {
    return (_price * _feeInfo.feeFraction) / _feeDenominator();
  }

  function _checkStartTime(uint256 _startTime) internal view returns (bool) {
    return _startTime < block.timestamp;
  }

  function _checkEndTime(uint256 _endTime) internal view returns (bool) {
    return _endTime > block.timestamp;
  }

  // EIP-712 verify
  function _verifyOrder(
    address _signer,
    Order memory _order,
    uint8 v,
    bytes32 r,
    bytes32 s
  ) public view returns (bool) {
    return _signer == ecrecover(_hashOrder(_order), v, r, s);
  }

  function _isERC721(address _contractAddress) internal view returns (bool) {
    return
      ERC165Checker.supportsInterface(_contractAddress, ERC721_INTERFACE_ID);
  }

  function _isOwner(
    address _owner,
    address _contractAddress,
    uint256 _tokenId
  ) internal view returns (bool) {
    IERC721 currentERC721 = IERC721(_contractAddress);
    return _owner == currentERC721.ownerOf(_tokenId);
  }

  // 전송 권한 있는지 확인
  function _checkApproval(address _owner, address _contractAddress)
    internal
    view
    returns (bool)
  {
    IERC721 currentERC721 = IERC721(_contractAddress);
    return currentERC721.isApprovedForAll(_owner, address(this));
  }

  // 창작자 로열티 계산
  function _calculationCreatorFee(
    address _contractAddress,
    uint256 _tokenId,
    uint256 _price
  ) internal view returns (address, uint256) {
    bool supportERC165 = ERC165Checker.supportsERC165(_contractAddress);

    if (supportERC165) {
      bool supportERC2981 = ERC165Checker.supportsInterface(
        _contractAddress,
        ERC2981_INTERFACE_ID
      );
      if (supportERC2981) {
        return IERC2981(_contractAddress).royaltyInfo(_tokenId, _price);
      } else {
        return (address(0), 0);
      }
    } else {
      return (address(0), 0);
    }
  }

  // 최종 판매금 계산
  function _totalEarning(
    uint256 _price,
    uint256 _fee,
    uint256 _creatorAmount
  ) internal pure returns (uint256) {
    return SafeMath.sub(SafeMath.sub(_price, _fee), _creatorAmount);
  }

  function _feeDenominator() internal pure virtual returns (uint96) {
    return 10000;
  }
}

```
    
# Stacks

### Environment
![Visual Studio Code](https://img.shields.io/badge/Visual%20Studio%20Code-007ACC?style=for-the-badge&logo=Visual%20Studio%20Code&logoColor=white)
![Git](https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=Git&logoColor=white)
![Github](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=GitHub&logoColor=white)
![Yarn](https://img.shields.io/badge/yarn-%232C8EBB.svg?style=for-the-badge&logo=yarn&logoColor=white)

### Development
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=Javascript&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=Next.js&logoColor=white)
![React Query](https://img.shields.io/badge/-React%20Query-FF4154?style=for-the-badge&logo=react%20query&logoColor=white)
![SASS](https://img.shields.io/badge/SASS-hotpink.svg?style=for-the-badge&logo=SASS&logoColor=white)

### DB
![MySQL](https://img.shields.io/badge/mysql-%2300f.svg?style=for-the-badge&logo=mysql&logoColor=white)

### CI/CD
![GitHub Actions](https://img.shields.io/badge/github%20actions-%232671E5.svg?style=for-the-badge&logo=githubactions&logoColor=white)
![AWS](https://img.shields.io/badge/AWS-%23FF9900.svg?style=for-the-badge&logo=amazon-aws&logoColor=white)


# 주요 기능 사진
### NFT 판매 등록
<img width="582" alt="스크린샷 2023-09-08 오후 12 38 06" src="https://github.com/ttap0704/cuniverse/assets/81610009/f680d537-ebf0-45c5-88bf-1908ea03ccf0">

### Collection (Smart Contract) 배포
<img width="435" alt="스크린샷 2023-09-08 오후 12 47 09" src="https://github.com/ttap0704/cuniverse/assets/81610009/3f7b1585-b19f-4ca7-aae4-716c5f213490">

### NFT 생성
<img width="427" alt="스크린샷 2023-09-08 오후 12 48 02" src="https://github.com/ttap0704/cuniverse/assets/81610009/1aadd87a-022f-47fe-be00-4b91b20f52d1">


# 디렉토리 구조
```bash
├── README.md
├── package.json
├── .pnp.cjs
├── .pnp.loader.mjs
└── src
    ├── app : 애플리케이션의 모든 page routes
        ├── api
        ├── account
        ├── assets
        ├── collection
        ├── contracts
        ├── minting
        └── collectors
    ├── components : 각 기능별 component 정의
    ├── css : global, components css 정의
    ├── queries : react-query를 사용한 custom hook정의
    ├── store : jotai를 사용한 client state 관리
    ├── utils : 공통적으로 사용되는 로직 작성
    ├── types : typescript type 정의
    ├── contracts : 자체 발행 ERC-721, 거래 스마트 콘트랙트(Cuniverse Hub) json 저장
    └── middleware.ts : page 이동 및 API 요청 시의 검증 로직 작성
```

