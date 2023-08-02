import { NextRequest, NextResponse } from "next/server";
import db from "../db";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.search);
  const address = searchParams.get("address");

  let pass = false,
    message = "",
    data: null | AccountInfoReponse = null;

  if (address) {
    try {
      // 최종으로 저장된 Account 조회
      const accountData: AccountInfoReponse[] = await db.query({
        sql: "SELECT * FROM accounts WHERE address = ?",
        values: [address],
      });

      pass = true;
      data = accountData[0] ?? null;
    } catch (err) {
      console.log(err);
    }
  }

  const res: APIResponse = { pass, message, data };

  return NextResponse.json(res);
}
