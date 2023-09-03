import { NextRequest, NextResponse } from "next/server";
import db from "../db";
import { Contract } from "ethers";
import ethersServerProvider from "@/utils/ethersServerProvider";
import { ZERO_ADDRESS } from "../../../../constants";
import { ipfsToHttps } from "@/utils/tools";
import NFTJson from "@/contracts/NFT.json";

export async function GET(request: NextRequest, response: NextResponse) {
  // Search Params 조회
  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.search);

  // Address, Token Id 조회
  const address = searchParams.get("address");
  let tokenId: null | BigInt | string = searchParams.get("token-id");

  let pass = false,
    message = "",
    data: NFTDetail | null = null;

  // Address와 Token Id 모두 있다면 로직 실행
  if (address && tokenId) {
    tokenId = BigInt(tokenId);

    let royalty = 0;

    // Contract Intance 생성
    const abi = NFTJson.abi;
    const contract = new Contract(address, abi).connect(ethersServerProvider);

    // Contract Name과 Metadata 조회
    const contractName: string = await contract
      .getFunction("name")
      .staticCall();
    let metadataUrl: string = ipfsToHttps(
      await contract.getFunction("tokenURI").staticCall(tokenId)
    );

    const metadataResponse = await fetch(`${metadataUrl}`);
    const metadata: NFTMetadata = await metadataResponse.json();

    if (metadata && metadata.image) {
      metadata.image = ipfsToHttps(metadata.image);
    }

    // 토근 Owner와 Contract Deployer 조회
    const owner = await contract.getFunction("ownerOf").staticCall(tokenId);

    // 현재 NFT 소유자 점검
    const owners: { nickname: string; address: string }[] = await db.query({
      sql: "SELECT nickname, address FROM accounts WHERE address = ?;",
      values: [owner],
    });

    // 컨트랙트 배포자 점검
    const deployer: { nickname: string; address: string }[] = await db.query({
      sql: `SELECT ac.nickname, ac.address, ct.id AS contractId
        FROM accounts ac
        INNER JOIN contracts ct ON ac.id = ct.accountId AND ct.contractAddress = ?`,
      values: [address],
    });

    // 현재 해당 NFT가 판매중인지 체크
    const saleResponse: SalesDetail[] = await db.query({
      sql: "SELECT * FROM sales WHERE contractAddress = ? AND tokenId = ? AND canceledAt IS NULL AND completedAt IS NULL;",
      values: [address, tokenId],
    });
    const sale = saleResponse[0] ?? null;

    // "Transfer" 사용자간 로그 가져오기
    const logs: NFTTransferLog[] = [];
    const transferFilter = contract.filters.Transfer(null, null, tokenId);
    const transferEvents = await contract.queryFilter(transferFilter);
    for (let i = transferEvents.length - 1; i >= 0; i--) {
      const curLog = transferEvents[i];
      const log = contract.interface.parseLog({
        data: curLog.data,
        topics: curLog.topics as string[],
      });

      if (!log) continue;
      logs.push({
        from: log.args[0],
        to: log.args[1],
        hash: curLog.transactionHash,
        name: log.name,
      });
    }

    // "Transfer" mint 이벤트 로그 가져오기
    const mintFilter = contract.filters.Transfer(ZERO_ADDRESS, null, null);
    const latestBlock = await ethersServerProvider.getBlock("latest");
    const latestBlockNumber = Number(latestBlock?.number) - 1;
    const mintEvents = await contract.queryFilter(
      mintFilter,
      Math.max(latestBlockNumber - 500000, 0),
      latestBlockNumber
    );
    const more: NFTMetadata[] = [];

    for (let i = mintEvents.length - 1; i >= 0; i--) {
      // 추천 NFT는 10개 까지
      if (more.length >= 10) break;

      const curLog = mintEvents[i];
      const log = contract.interface.parseLog({
        data: curLog.data,
        topics: curLog.topics as string[],
      });

      // from == '0x0000000000000000000000000000000000000000' 일 때가 Mint이기 때문에
      // 해당 address만 필터링
      if (!log) continue;

      try {
        const abortController = new AbortController();
        const timeout = setTimeout(() => abortController.abort(), 1000);

        let metadataUrl: string = ipfsToHttps(
          await contract.getFunction("tokenURI").staticCall(log.args[2])
        );

        const metadataResponse = await fetch(`${metadataUrl}`, {
          signal: abortController.signal,
        });
        clearTimeout(timeout);

        const metadata: NFTMetadata = {
          ...(await metadataResponse.json()),
          tokenId: BigInt(log.args[2]).toString(),
        };
        more.push(metadata);
      } catch (err) {
        // console.log(err);
      }
    }

    // 창작자 로열티 할당하기
    try {
      const royaltyInfo = contract.getFunction("royaltyInfo");

      if (royaltyInfo) {
        const royaltyRes = await royaltyInfo.staticCall(tokenId, 10000);
        royalty = Number(royaltyRes[1]);
      }
    } catch (err) {
      console.log(err);
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
        nickname: "알 수 없음",
        address: "알 수 없음",
      },
      moreNFTs: more,
      sale,
      royalty,
      logs,
    };
  }

  const res: APIResponse = { pass, message, data };

  return NextResponse.json(res);
}
