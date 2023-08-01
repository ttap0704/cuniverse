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
  }

  const res: APIResponse = { pass, message, data };

  return NextResponse.json(res);
}
