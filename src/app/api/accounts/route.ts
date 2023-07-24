import { cookies } from "next/dist/client/components/headers";
import { NextRequest, NextResponse } from "next/server";
import Web3Token from "web3-token";
import db from "../db";

export async function GET(request: NextRequest) {
  // 인증 토큰 조회
  const authToken = request.headers.get("Authorization");
  let pass = false,
    message = "",
    data: null | AccountInfoReponse = null,
    token = "";

  // 인증토큰 slice
  if (authToken) {
    token = authToken.slice(7);
  }

  if (token) {
    try {
      // web3-token으로 인증확인
      const valifiedToken = await Web3Token.verify(token);
      const adderss = valifiedToken.address;

      // address 토대로 accounts 조회
      const accountCntData: { cnt: number }[] = await db.query({
        sql: "SELECT COUNT(*) AS cnt FROM accounts WHERE address = ?",
        values: [adderss],
      });

      // 만약 데이터가 하나도 없다면 Insert
      if (accountCntData[0].cnt == 0) {
        const insertData = await db.query({
          sql: "INSERT INTO accounts (address) VALUES (?)",
          values: [adderss],
        });
      }

      // 최종으로 저장된 Account 조회
      const accountData: AccountInfoReponse[] = await db.query({
        sql: "SELECT id, address, nickname FROM accounts WHERE address = ?",
        values: [adderss],
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
