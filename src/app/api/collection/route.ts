import { NextRequest, NextResponse } from "next/server";
import db from "../db";
import { S3_IMAGES_URL, ZERO_ADDRESS } from "../../../../constants";
import ethersServerProvider from "@/utils/ethersServerProvider";
import { Contract } from "ethers";
import { ipfsToHttps } from "@/utils/tools";

type ContractQueryResponse = Omit<CollectionDetail, "NFTs">;

export async function GET(request: NextRequest, response: NextResponse) {
  // Search Params 조회
  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.search);

  // Address, Token Id 조회
  const address = searchParams.get("address");
  let pass = false,
    message = "",
    data: CollectionDetail | null = null;

  // Address가 있다면 로직 실행
  if (address) {
    const contract: ContractQueryResponse[] = await db.query({
      sql: `SELECT ct.*, ac.nickname AS deployerNickname, ac.address AS deployerAddress
      FROM contracts ct
      INNER JOIN accounts ac ON ct.accountId = ac.id
      WHERE ct.contractAddress = ?;`,
      values: [address],
    });
    if (contract.length == 1) {
      // Smart Contract ABI 조회
      const getAbi = await fetch(
        `https://api-sepolia.etherscan.io/api?module=contract&action=getabi&address=${address}&apikey=${process.env.ETHERSCAN_API_KEY}`
      );
      const abiRespoonse: { status: string; message: string; result: string } =
        await getAbi.json();

      // ABI 조회가 성공이라면 로직 실행
      if (abiRespoonse.message == "OK") {
        // totalSupply 조회 및 업데이트 로직
        // (totalSupply는 옵션이기 때문에 직접 구현)
        const baseContract = new Contract(
          address,
          JSON.parse(abiRespoonse.result)
        ).connect(ethersServerProvider);
        const latestBlock = await ethersServerProvider.getBlock("latest");

        // 완성된 블록조회를 위해 -1
        const latestBlockNumber = Number(latestBlock?.number) - 1;

        let totalSupply = contract[0].totalSupply ?? 0;
        // 마지막 조회당시 블록넘버와 같지않다면 로직 실행
        if (contract[0].latestBlockNumber != latestBlockNumber) {
          const fromBlock = contract[0].latestBlockNumber
            ? contract[0].latestBlockNumber + 1
            : 0;

          // mint 시, Transfer Event만 조회
          const filter = baseContract.filters.Transfer(
            "0x0000000000000000000000000000000000000000",
            null,
            null
          );
          const logs = await baseContract.queryFilter(
            filter,
            fromBlock,
            latestBlockNumber
          );

          totalSupply += logs.length;

          // 업데이트
          await db.query({
            sql: "UPDATE contracts SET latestBlockNumber = ?, totalSupply = ? WHERE contractAddress = ?;",
            values: [latestBlockNumber, totalSupply, address],
          });
        }

        // "Transfer" 이벤트 로그 가져오기
        const mintedFilter = baseContract.filters.Transfer(
          ZERO_ADDRESS,
          null,
          null
        );
        const transferEvents = await baseContract.queryFilter(mintedFilter);
        const nfts: NFTMetadata[] = [];
        for (let i = transferEvents.length - 1; i >= 0; i--) {
          // ** paging 추가 필요 ** //
          const curLog = transferEvents[i];
          const log = baseContract.interface.parseLog({
            data: curLog.data,
            topics: curLog.topics as string[],
          });

          if (!log) continue;
          let metadataUrl: string = ipfsToHttps(
            await baseContract.getFunction("tokenURI").staticCall(log.args[2])
          );

          const metadataResponse = await fetch(`${metadataUrl}`);
          const metadata: NFTMetadata = {
            ...(await metadataResponse.json()),
            tokenId: BigInt(log.args[2]).toString(),
          };
          nfts.push(metadata);
        }

        pass = true;
        data = {
          ...contract[0],
          banner: contract[0].banner
            ? `${S3_IMAGES_URL}/images/${contract[0].banner}`
            : contract[0].banner,
          profile: contract[0].profile
            ? `${S3_IMAGES_URL}/images/${contract[0].profile}`
            : contract[0].profile,
          latestBlockNumber,
          totalSupply,
          nfts,
        };
      }
    }
  }

  const res: APIResponse = { pass, message, data };

  return NextResponse.json(res);
}
