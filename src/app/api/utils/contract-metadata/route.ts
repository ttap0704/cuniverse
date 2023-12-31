import { NextRequest, NextResponse } from "next/server";
import { Contract } from "ethers";
import ethersServerProvider from "@/utils/ethersServerProvider";
import NFTJson from "@/contracts/NFT.json";

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
    try {
      const abi = NFTJson.abi;

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

        try {
          const searchFunction = contract.getFunction(functionKey);

          if (searchFunction !== undefined) {
            const value: any = await searchFunction.staticCall(...argsArr);
            data[functionKey] = value;
          }
        } catch (err) {
          console.log(err);
        }
      }
    } catch (err) {
      console.log(err);
    }
  }

  const res: APIResponse = { pass, message, data };

  return NextResponse.json(res);
}
