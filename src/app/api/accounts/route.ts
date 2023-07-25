import { cookies } from "next/dist/client/components/headers";
import { NextRequest, NextResponse } from "next/server";
import Web3Token from "web3-token";
import db from "../db";

export async function GET(request: NextRequest) {
  const address = cookies().get("wallet-address")?.value;
  let pass = false,
    message = "",
    data: null | AccountInfoReponse = null;

  if (address) {
    try {
      // address 토대로 accounts 조회
      const accountCntData: { cnt: number }[] = await db.query({
        sql: "SELECT COUNT(*) AS cnt FROM accounts WHERE address = ?",
        values: [address],
      });

      // 만약 데이터가 하나도 없다면 Insert
      if (accountCntData[0].cnt == 0) {
        const insertData = await db.query({
          sql: "INSERT INTO accounts (address) VALUES (?)",
          values: [address],
        });
      }

      // 최종으로 저장된 Account 조회
      const accountData: AccountInfoReponse[] = await db.query({
        sql: "SELECT id, address, nickname, banner FROM accounts WHERE address = ?",
        values: [address],
      });

      pass = true;
      data = accountData[0];
    } catch (err) {
      console.log(err);
    }
  }

  const res: APIResponse = { pass, message, data };

  return NextResponse.json(res);
}
