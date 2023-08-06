import { cookies } from "next/dist/client/components/headers";
import { NextResponse } from "next/server";
import alchemy from "@/utils/alchemy";
import { GetContractsForOwnerResponse } from "alchemy-sdk";
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
        sql: "SELECT * FROM contracts WHERE account_id = ?;",
        values: [accountResponse[0].id],
      });
    }
  }

  const res: APIResponse = { pass, message, data };

  return NextResponse.json(res);
}
