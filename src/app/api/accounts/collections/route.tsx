import { cookies } from "next/dist/client/components/headers";
import { NextResponse } from "next/server";
import alchemy from "@/utils/alchemy";
import { OwnedNftsResponse } from "alchemy-sdk";

export async function GET() {
  // cookies에서 wallet address 가져오기
  const address = cookies().get("wallet-address")?.value;
  let pass = false,
    message = "",
    data: OwnedNftsResponse | null = null;

  if (address) {
    pass = true;

    // 해당 Wallet Address가 갖고있는 NFT 가져오기
    data = await alchemy.nft.getNftsForOwner(address);
  }

  const res: APIResponse = { pass, message, data };

  return NextResponse.json(res);
}
