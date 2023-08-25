import { cookies } from "next/dist/client/components/headers";
import { NextResponse } from "next/server";
import alchemy from "@/utils/alchemy";
import { ipfsToHttps } from "@/utils/tools";
import db from "../../db";

export async function GET() {
  // cookies에서 wallet address 가져오기
  const address = cookies().get("wallet-address")?.value;
  let pass = false,
    message = "",
    data: NFTMetadata[] | null = null;

  if (address) {
    pass = true;

    // 판매중인 NFT 조회
    const sales: { contractAddress: string; tokenId: number; price: number }[] =
      await db.query({
        sql: `SELECT contractAddress, tokenId, price
      FROM sales sa
      INNER JOIN accounts ac ON ac.id = sa.accountId
      WHERE ac.address = ? AND sa.canceledAt IS NULL AND sa.completedAt IS NULL;`,
        values: [address],
      });

    // 해당 Wallet Address가 갖고있는 NFT 가져오기
    data = [];
    const ownerNFTs = await alchemy.nft.getNftsForOwner(address);
    for (let i = 0; i < ownerNFTs.ownedNfts.length; i++) {
      const cur = ownerNFTs.ownedNfts[i];
      const saleData = sales.find(
        (item) =>
          item.contractAddress == cur.contract.address &&
          `${item.tokenId}` == cur.tokenId
      );

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
        price: saleData ? saleData.price : undefined,
      });
    }
  }

  const res: APIResponse = { pass, message, data };

  return NextResponse.json(res);
}
