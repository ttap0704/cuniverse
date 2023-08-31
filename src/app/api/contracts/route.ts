import { NextRequest, NextResponse } from "next/server";
import db from "../db";

export async function GET(requst: NextRequest) {
  let pass = false,
    message = "",
    data: NFTMetadata[] | null = null;

  data = await db.query({
    sql: "SELECT * FROM contracts ORDER BY createdAt DESC LIMIT 5;",
    values: [],
  });
  const res: APIResponse = { pass, message, data };

  return NextResponse.json(res);
}
