import { NextRequest, NextResponse } from "next/server";
import { Contract } from "ethers";
import ethersServerProvider from "@/utils/ethersServerProvider";
import { ipfsToHttps } from "@/utils/tools";
import NFTJson from "@/contracts/NFT.json";
import { ZERO_ADDRESS } from "../../../../../constants";

export async function GET(request: NextRequest, response: NextResponse) {
  // Search Params 조회
  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.search);

  // Address, Token Id 조회
  const address = searchParams.get("address");
  let tokenId: null | BigInt | string = searchParams.get("token-id");

  let pass = false,
    message = "",
    data: NFTMetadata[] | null = null;

  // Address와 Token Id 모두 있다면 로직 실행
  if (address && tokenId) {
    try {
      tokenId = BigInt(tokenId);

      // Contract Intance 생성
      const abi = NFTJson.abi;
      const contract = new Contract(address, abi).connect(ethersServerProvider);

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
        if (more.length >= 5) break;

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

      pass = true;
      data = more;
    } catch (err) {
      console.log(err);
    }
  }

  const res: APIResponse = { pass, message, data };

  return NextResponse.json(res);
}
