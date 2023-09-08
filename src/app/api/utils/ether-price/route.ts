import { NextRequest, NextResponse } from "next/server";
import etherscanProvider from "@/utils/etherscanProvider";

export async function GET(request: NextRequest, response: NextResponse) {
  let pass = false,
    message = "",
    data: number | null = null;

  try {
    const exchangeRateRes = await fetch(
      "https://quotation-api-cdn.dunamu.com/v1/forex/recent?codes=FRX.KRWUSD",
      {
        method: "GET",
      }
    );
    const exchangeRate = Number((await exchangeRateRes.json())[0].openingPrice);

    if (exchangeRate) {
      pass = true;
      data = (await etherscanProvider.getEtherPrice()) * exchangeRate;
    }
  } catch (err) {
    console.log(err);
  }

  const res: APIResponse = {
    pass,
    message,
    data,
  };

  return NextResponse.json(res);
}
