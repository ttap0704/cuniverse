import { cookies } from "next/dist/client/components/headers";
import { NextRequest, NextResponse } from "next/server";
import alchemy from "@/utils/alchemy";
import { ipfsToHttps } from "@/utils/tools";
import db from "../../db";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.search);
  const address = searchParams.get("address");

  let pass = false,
    message = "",
    data: NFTMetadata[] | null = null;

  if (address) {
    try {
      pass = true;
      // 해당 Wallet Address가 갖고있는 NFT 가져오기
      data = [];

      const sales = await db.query({
        sql: `SELECT COUNT(*) AS cnt
        FROM sales sa
        INNER JOIN accounts ac ON ac.id = sa.accountId
        WHERE ac.address = ? GROUP BY contractAddress, tokenId;`,
        values: [address],
      });

      console.log(sales);

      const ownerNFTs = await alchemy.nft.getNftsForOwner(address);
      for (let i = 0; i < ownerNFTs.ownedNfts.length; i++) {
        const cur = ownerNFTs.ownedNfts[i];

        let image = "/";
        if (cur.rawMetadata && cur.rawMetadata.image) {
          image = ipfsToHttps(cur.rawMetadata.image);
        }

        data.push({
          tokenId: cur.tokenId,
          title: cur.title,
          description: cur.description,
          name: cur.title,
          contract: {
            address: cur.contract.address,
            name: cur.contract.name ?? "Untitled Collection",
          },
          image,
        });
      }
    } catch (err) {
      console.log(err);
    }
  }

  const res: APIResponse = { pass, message, data };

  return NextResponse.json(res);
}
