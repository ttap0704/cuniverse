import { cookies } from "next/dist/client/components/headers";
import { NextRequest, NextResponse } from "next/server";
import db from "../../db";

export async function GET() {
  // cookies에서 wallet address 가져오기
  const address = cookies().get("wallet-address")?.value;
  let pass = false,
    message = "",
    data: ContractDetail[] | null = null;

  if (address) {
    // 해당 Wallet Address가 갖고있는 Contracts 가져오기
    const accountResponse: { id: number }[] = await db.query({
      sql: "SELECT id FROM accounts WHERE address = ?;",
      values: [address],
    });

    if (accountResponse.length == 1) {
      pass = true;

      data = await db.query({
        sql: "SELECT * FROM contracts WHERE account_id = ? ORDER BY created_at DESC;",
        values: [accountResponse[0].id],
      });
    }
  }

  const res: APIResponse = { pass, message, data };

  return NextResponse.json(res);
}

export async function POST(request: NextRequest) {
  const address = cookies().get("wallet-address")?.value;
  let pass = false,
    message = "",
    data = false;

  if (address) {
    try {
      // Update Data 확인
      const body = await request.json();
      const insertData: CreateContractRequest = body.data;

      let sql = "INSERT INTO contracts ";
      const values = [],
        sqlList = [];

      // Query 설정 및 Update Value Array 추가
      for (const [key, val] of Object.entries(insertData)) {
        sqlList.push(`${key}`);
        values.push(val);
      }

      // 마지막으로 address로 WHERE절 처리
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
