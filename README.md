# 프로젝트명
[Cuniverse](https://cu-niverse.com) (NFT Market Place)

# 소개
메타마스크를 통해 Web3 지갑을 웹 사이트와 연동하여 <br/>
NFT 컬렉션 배포/민팅, 개인간 NFT 거래가 가능한 NFT Market Place 입니다. <br/>
(해당 프로젝트는 Ethereum Sepolia Network 환경에서 실행됩니다.)

# 주요 기능
  - ERC-721 (NFT) 스마트 콘트랙트 배포
  - IPFS를 통해 이미지 및 메타데이터 업로드 후, NFT 민팅
  - 직접 설계한 NFT 거래 콘트랙트를 통해, 개인간 NFT 거래 ([Cuniverse Hub](https://sepolia.etherscan.io/address/0x41aae050DdCDf5894099B9d56d863a201Dc09807))
    
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

