import { cookies } from "next/dist/client/components/headers";
import { NextRequest, NextResponse } from "next/server";
import db from "../../db";

export async function PUT(request: NextRequest) {
  const address = cookies().get("wallet-address")?.value;
  let pass = false,
    message = "",
    data = false;

  if (address) {
    try {
      // Update Data 확인
      const body = await request.json();
      const updatedata: UpdateAccountRequest = body.data;

      let sql = "UPDATE accounts SET";
      const values = [],
        sqlList = [];

      // Query 설정 및 Update Value Array 추가
      for (const [key, val] of Object.entries(updatedata)) {
        sqlList.push(` ${key} = ?`);
        values.push(val);
      }

      // 마지막으로 address로 WHERE절 처리
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
