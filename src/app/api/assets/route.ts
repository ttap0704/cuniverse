import { NextRequest, NextResponse } from "next/server";
import db from "../db";
import { Contract } from "ethers";
import ethersServerProvider from "@/utils/ethersServerProvider";
import { ZERO_ADDRESS } from "../../../../constants";

export async function GET(request: NextRequest, response: NextResponse) {
  // Search Params 조회
  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.search);

  // Address, Token Id 조회
  const address = searchParams.get("address");
  const tokenId = BigInt(Number(searchParams.get("tokenId")));
  let pass = false,
    message = "",
    data: NFTDetail | null = null;

  // Address와 Token Id 모두 있다면 로직 실행
  if (address && tokenId >= 0) {
    // Etherscan API 통해
    // Smart Contract ABI 조회
    const getAbi = await fetch(
      `https://api-sepolia.etherscan.io/api?module=contract&action=getabi&address=${address}&apikey=${process.env.ETHERSCAN_API_KEY}`
    );
    const abiRespoonse: { status: string; message: string; result: string } =
      await getAbi.json();

    // ABI 조회가 성공이라면 로직 실행
    if (abiRespoonse.message == "OK") {
      const abi = JSON.parse(abiRespoonse.result);

      // Contract Intance 생성
      const contract = new Contract(address, abi).connect(ethersServerProvider);

      // Contract Name과 Metadata 조회
      const contractName: string = await contract
        .getFunction("name")
        .staticCall();
      let metadataUrl: string = await contract
        .getFunction("tokenURI")
        .staticCall(tokenId);

      // ipfs 프로토콜을 https 프로토콜로 조정
      if (metadataUrl.includes("ipfs://")) {
        metadataUrl = metadataUrl.replace("ipfs://", "https://ipfs.io/ipfs/");
      }

      const metadataResponse = await fetch(`${metadataUrl}`);
      const metadata: NFTMetadata = await metadataResponse.json();

      if (metadata && metadata.image && metadata.image.includes("ipfs://")) {
        metadata.image = metadata.image.replace(
          "ipfs://",
          "https://ipfs.io/ipfs/"
        );
      }

      // 토근 Owner와 Contract Deployer 조회
      const owner = await contract.getFunction("ownerOf").staticCall(tokenId);
      const getDeployer = await fetch(
        `https://api-sepolia.etherscan.io/api?module=contract&action=getcontractcreation&contractaddresses=${address}&apikey=${process.env.ETHERSCAN_API_KEY}`
      );
      const deployerReponse = await getDeployer.json();

      // 현재 NFT 소유자 점검
      const owners: { nickname: string; address: string }[] = await db.query({
        sql: "SELECT nickname, address FROM accounts WHERE address = ?;",
        values: [owner],
      });

      // 컨트랙트 배포자 점검
      const deployer: { nickname: string; address: string }[] = await db.query({
        sql: `SELECT ac.nickname, ac.address, ct.id AS contractId
        FROM accounts ac
        LEFT JOIN contracts ct ON ac.id = ct.accountId AND ct.contractAddress = ?
        WHERE address = ?;`,
        values: [address, deployerReponse["result"][0]["contractCreator"]],
      });

      // 현재 해당 NFT가 판매중인지 체크
      const saleResponse: { endTime: string; price: number }[] = await db.query(
        {
          sql: "SELECT price, endTime FROM sales WHERE contractAddress = ? AND tokenId = ?;",
          values: [address, tokenId],
        }
      );
      const sale = saleResponse[0] ?? null;

      // "Transfer" 이벤트 로그 가져오기
      const filter = contract.filters.Transfer(ZERO_ADDRESS, null, null);
      const latestBlock = await ethersServerProvider.getBlock("latest");
      const latestBlockNumber = Number(latestBlock?.number) - 1;
      const transferEvents = await contract.queryFilter(
        filter,
        Math.max(latestBlockNumber - 500000, 0),
        latestBlockNumber
      );
      const more: NFTMetadata[] = [];
      for (let i = transferEvents.length - 1; i >= 0; i--) {
        // 추천 NFT는 10개 까지
        if (more.length >= 10) break;

        const curLog = transferEvents[i];
        const log = contract.interface.parseLog({
          data: curLog.data,
          topics: curLog.topics as string[],
        });

        // from == '0x0000000000000000000000000000000000000000' 일 때가 Mint이기 때문에
        // 해당 address만 필터링
        if (!log) continue;
        let metadataUrl: string = await contract
          .getFunction("tokenURI")
          .staticCall(log.args[2]);

        // ipfs 프로토콜을 https 프로토콜로 조정
        if (metadataUrl.includes("ipfs://")) {
          metadataUrl = metadataUrl.replace("ipfs://", "https://ipfs.io/ipfs/");
        }

        const metadataResponse = await fetch(`${metadataUrl}`);
        const metadata: NFTMetadata = {
          ...(await metadataResponse.json()),
          tokenId: BigInt(log.args[2]).toString(),
        };
        more.push(metadata);
      }

      pass = true;
      data = {
        ...metadata,
        tokenId: `${tokenId}`,
        contract: {
          name: contractName,
          address,
        },
        owners: owners[0] ?? {
          nickname: null,
          address: owner,
        },
        deployer: deployer[0] ?? {
          nickname: deployerReponse["result"][0]["contractCreator"]
            ? null
            : "알 수 없음",
          address: deployerReponse["result"][0]["contractCreator"],
        },
        moreNFTs: more,
        sale,
      };
    }
  }

  const res: APIResponse = { pass, message, data };

  return NextResponse.json(res);
}
