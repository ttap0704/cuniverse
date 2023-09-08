import { NextRequest, NextResponse } from "next/server";
import { Contract } from "ethers";
import ethersServerProvider from "@/utils/ethersServerProvider";
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
    data: NFTTransferLog[] | null = null;

  // Address와 Token Id 모두 있다면 로직 실행
  if (address && tokenId) {
    try {
      tokenId = BigInt(tokenId);

      // Contract Intance 생성
      const abi = NFTJson.abi;
      const contract = new Contract(address, abi).connect(ethersServerProvider);

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

      pass = true;
      data = logs;
    } catch (err) {
      console.log(err);
    }
  }

  const res: APIResponse = { pass, message, data };

  return NextResponse.json(res);
}
