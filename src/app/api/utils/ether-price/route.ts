import { NextRequest, NextResponse } from "next/server";
import etherscanProvider from "@/utils/etherscanProvider";

export async function GET(request: NextRequest, response: NextResponse) {
  const exchangeRateRes = await fetch(
    "https://quotation-api-cdn.dunamu.com/v1/forex/recent?codes=FRX.KRWUSD",
    {
      method: "GET",
    }
  );

  const exchangeRate = Number((await exchangeRateRes.json())[0].openingPrice);
  const res: APIResponse = {
    pass: true,
    message: "",
    data: (await etherscanProvider.getEtherPrice()) * exchangeRate,
  };

  return NextResponse.json(res);
}
