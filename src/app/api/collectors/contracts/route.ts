import { NextRequest, NextResponse } from "next/server";
import db from "../../db";

export async function GET(requst: NextRequest) {
  // cookies에서 wallet address 가져오기
  const url = new URL(requst.url);
  const searchParams = new URLSearchParams(url.search);
  const address = searchParams.get("address");
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
        sql: "SELECT * FROM contracts WHERE accountId = ? ORDER BY createdAt DESC;",
        values: [accountResponse[0].id],
      });
    }
  }

  const res: APIResponse = { pass, message, data };

  return NextResponse.json(res);
}
