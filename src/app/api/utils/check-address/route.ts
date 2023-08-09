import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/dist/client/components/headers";
import db from "../../db";
import { Contract } from "ethers";
import ethersServerProvider from "@/utils/ethersServerProvider";

export async function GET(request: NextRequest, response: NextResponse) {
  // cookies 조회
  const address = cookies().get("wallet-address")?.value;
  // Search Params 조회
  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.search);
  // Contract Address 조회
  const contractAddress = searchParams.get("contract-address");

  let pass = false,
    message = "",
    data: { name: string; symbol: string } | null = null;

  // Address와 contractAddress 모두 있다면 로직 실행
  if (address && contractAddress) {
    // 현재 NFT 소유자 점검
    const check: { cnt: number }[] = await db.query({
      sql: `
        SELECT COUNT(*) AS cnt
        FROM accounts ac
        INNER JOIN contracts ct ON ac.id = ct.accountId
        WHERE ct.contractAddress =? AND ac.address = ?;
      `,
      values: [contractAddress, address],
    });

    if (check[0].cnt == 0) {
      // Etherscan API 통해
      const getDeployer = await fetch(
        `https://api-sepolia.etherscan.io/api?module=contract&action=getcontractcreation&contractaddresses=${contractAddress}&apikey=${process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY}`
      );
      const deployerReponse = await getDeployer.json();
      if (
        deployerReponse["result"] &&
        deployerReponse["result"][0]["contractCreator"] == address.toLowerCase()
      ) {
        const getAbi = await fetch(
          `https://api-sepolia.etherscan.io/api?module=contract&action=getabi&address=${contractAddress}&apikey=${process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY}`
        );
        const abiRespoonse: {
          status: string;
          message: string;
          result: string;
        } = await getAbi.json();

        if (abiRespoonse.message == "OK") {
          const abi = JSON.parse(abiRespoonse.result);

          // Contract Intance 생성
          const contract = new Contract(contractAddress, abi).connect(
            ethersServerProvider
          );

          // Contract Name과 Symbol 조회
          const name: string = await contract.getFunction("name").staticCall();
          const symbol: string = await contract
            .getFunction("symbol")
            .staticCall();

          data = {
            name,
            symbol,
          };
        }
      }
    }
  }

  const res: APIResponse = { pass, message, data };

  return NextResponse.json(res);
}
