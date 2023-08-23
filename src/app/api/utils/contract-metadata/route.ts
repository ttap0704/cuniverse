import { NextRequest, NextResponse } from "next/server";
import { Contract } from "ethers";
import ethersServerProvider from "@/utils/ethersServerProvider";

export async function GET(request: NextRequest, response: NextResponse) {
  // Search Params 조회
  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.search);
  // Contract Address 조회
  const contractAddress = searchParams.get("contract-address");
  const needs = searchParams.get("needs");

  let pass = false,
    message = "",
    data: { [key: string]: string } | null = null;

  if (contractAddress && needs) {
    // Etherscan API 통해

    const getAbi = await fetch(
      `https://api-sepolia.etherscan.io/api?module=contract&action=getabi&address=${contractAddress}&apikey=${process.env.ETHERSCAN_API_KEY}`
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

      pass = true;
      data = {};
      const needsArr = needs.split(",");

      // For BigInt Parse Error
      (BigInt.prototype as any).toJSON = function () {
        return this.toString();
      };

      for (let i = 0; i < needsArr.length; i++) {
        const functionKey = needsArr[i];
        const args = searchParams.get(`${functionKey}-args`);

        let argsArr: any = [];

        if (args) {
          argsArr = args.split(",");
        }

        const searchFunction = (contract as any)[functionKey];

        if (searchFunction !== undefined) {
          const value: any = await searchFunction.staticCall(...argsArr);
          data[functionKey] = value;
        }
      }
    }
  }

  const res: APIResponse = { pass, message, data };

  return NextResponse.json(res);
}
