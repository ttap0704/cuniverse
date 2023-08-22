import db from "@/app/api/db";
import { cookies } from "next/dist/client/components/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const address = cookies().get("wallet-address")?.value;
  let pass = false,
    message = "",
    data = false;

  if (address) {
    try {
      // Update Data 확인
      const body = await request.json();
      const insertData: SalesDetail = body.data;

      let sql = "INSERT INTO sales ";
      const values = [],
        sqlList = [];

      for (const [key, val] of Object.entries(insertData)) {
        sqlList.push(`${key}`);
        values.push(val);
      }

      sql +=
        "(" +
        sqlList.join(", ") +
        ") VALUES (" +
        sqlList.map(() => "?").join(", ") +
        ");";
      // 최종으로 Account 수정

      const insertRes = await db.query({
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
