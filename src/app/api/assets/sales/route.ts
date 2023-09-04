import { NextRequest, NextResponse } from "next/server";
import db from "../../db";

export async function GET(requst: NextRequest) {
  let pass = false,
    message = "",
    data: NFTMetadata[] | null = null;

  // 해당 Wallet Address가 갖고있는 Contracts 가져오기
  const salesList: SalesDetail[] = await db.query({
    sql: `SELECT id, title, name, image, price, contractAddress, tokenId 
    FROM sales WHERE canceledAt IS NULL AND completedAt IS NULL AND FROM_UNIXTIME(endTime) >= NOW()
    ORDER BY createdAt DESC LIMIT 5;`,
    values: [],
  });

  data = salesList.map((sale) => {
    return {
      title: sale.title,
      name: sale.name,
      image: sale.image,
      price: Number(sale.price),
      tokenId: `${sale.tokenId}`,
      contract: {
        address: sale.contractAddress,
        name: sale.title,
      },
    };
  });
  const res: APIResponse = { pass, message, data };

  return NextResponse.json(res);
}
