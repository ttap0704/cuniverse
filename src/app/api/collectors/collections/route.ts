import { cookies } from "next/dist/client/components/headers";
import { NextRequest, NextResponse } from "next/server";
import alchemy from "@/utils/alchemy";
import { OwnedNftsResponse } from "alchemy-sdk";
import ethersServerProvider from "@/utils/ethersServerProvider";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.search);
  const address = searchParams.get("address");

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
