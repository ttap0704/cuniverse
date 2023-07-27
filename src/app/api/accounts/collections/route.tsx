import { cookies } from "next/dist/client/components/headers";
import { NextRequest, NextResponse } from "next/server";
import alchemy from "@/utils/alchemy";
import { OwnedNftsResponse } from "alchemy-sdk";

export async function GET(request: NextRequest) {
  // 인증 토큰 조회
  const address = cookies().get("wallet-address")?.value;
  let pass = false,
    message = "",
    data: OwnedNftsResponse | null = null;

  if (address) {
    pass = true;
    data = await alchemy.nft.getNftsForOwner(address);
    // data = await alchemy.nft.getNftsForOwner(
    //   "0x7714Ca634a9CA3bc085536cD3AB4580096437a73"
    // );
  }

  const res: APIResponse = { pass, message, data };

  return NextResponse.json(res);
}
