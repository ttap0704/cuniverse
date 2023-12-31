import { NextRequest, NextResponse } from "next/server";
import db from "../db";

export async function GET(request: NextRequest) {
  let pass = false,
    message = "",
    data: Banner[] = [];

  try {
    // 저장된 Collector(Account) 조회
    const banners: Banner[] = await db.query({
      sql: "SELECT * FROM banners ORDER BY createdAt DESC",
      values: [],
    });

    pass = true;
    data = banners;
  } catch (err) {
    console.log(err);
  }

  const res: APIResponse = { pass, message, data };

  return NextResponse.json(res);
}
