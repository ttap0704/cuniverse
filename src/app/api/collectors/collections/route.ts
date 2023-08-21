import { cookies } from "next/dist/client/components/headers";
import { NextRequest, NextResponse } from "next/server";
import alchemy from "@/utils/alchemy";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.search);
  const address = searchParams.get("address");

  let pass = false,
    message = "",
    data: NFTMetadata[] | null = null;

  if (address) {
    pass = true;
    // 해당 Wallet Address가 갖고있는 NFT 가져오기
    data = [];
    const ownerNFTs = await alchemy.nft.getNftsForOwner(address);
    for (let i = 0; i < ownerNFTs.ownedNfts.length; i++) {
      const cur = ownerNFTs.ownedNfts[i];

      let image = "/";
      if (cur.rawMetadata && cur.rawMetadata.image) {
        let imageUrl = cur.rawMetadata.image;
        if (imageUrl.includes("ipfs://")) {
          imageUrl = imageUrl.replace("ipfs://", "https://ipfs.io/ipfs/");
        }

        image = imageUrl;
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
  }

  const res: APIResponse = { pass, message, data };

  return NextResponse.json(res);
}
