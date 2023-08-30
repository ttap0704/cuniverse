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

export async function PUT(request: NextRequest) {
  const address = cookies().get("wallet-address")?.value;
  let pass = false,
    message = "",
    data = false;

  if (address) {
    try {
      // Update Data 확인
      const body = await request.json();
      const updatedata: UpdateAccountSalesRequest = body.data;

      let sql = "UPDATE sales SET";
      const values = [],
        sqlList = [];

      // Query 설정 및 Update Value Array 추가
      for (const [key, val] of Object.entries(updatedata)) {
        if (["contractAddress", "tokenId", "accountId"].includes(key)) continue;

        sqlList.push(` ${key} = ?`);
        if (["canceledAt", "completedAt"].includes(key))
          values.push(new Date(Number(val)));
        else values.push(val);
      }

      sql +=
        sqlList.join(",") +
        ` WHERE contractAddress = ? AND tokenId = ? AND accountId = ?`;
      values.push(
        updatedata.contractAddress,
        updatedata.tokenId,
        updatedata.accountId
      );

      console.log({ sql, values });
      // 최종으로 Sales 수정
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
