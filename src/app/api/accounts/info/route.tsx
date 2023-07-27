import { cookies } from "next/dist/client/components/headers";
import { NextRequest, NextResponse } from "next/server";
import db from "../../db";

export async function GET(request: NextRequest) {
  // 인증 토큰 조회
  const address = cookies().get("wallet-address")?.value;
  let pass = false,
    message = "",
    data = false;

  if (address) {
    try {
      const body = await request.json();
      const updatedata: UpdateAccountRequest = body.data;

      let sql = "UPDATE accounts SET";
      const values = [],
        sqlList = [];

      for (const [key, val] of Object.entries(updatedata)) {
        sqlList.push(` ${key} = ?`);
        values.push(val);
      }

      sql += sqlList.join(",") + " WHERE address = ?";
      values.push(address);
      // 최종으로 Account 수정
      const updateRes = await db.query({
        sql,
        values,
      });

      pass = true;
      data = true;
    } catch (err) {
      console.log(err);
    }
  }

  const res: APIResponse = { pass, message, data };

  return NextResponse.json(res);
}
