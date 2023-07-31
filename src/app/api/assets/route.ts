import { NextRequest, NextResponse } from "next/server";
import alchemy from "@/utils/alchemy";
import { NftAttributeRarity } from "alchemy-sdk";
import db from "../db";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const search_params = new URLSearchParams(url.search);
  const address = search_params.get("address");
  const tokenId = BigInt(Number(search_params.get("tokenId")));
  let pass = false,
    message = "",
    data: NFTDetail | null = null;

  if (address && tokenId) {
    pass = true;

    const metadata = await alchemy.nft.getNftMetadata(address, tokenId);
    // computeRarity는 아직 Test Net 지원 X
    // 임시데이터 활용하여 테스트 진행
    // const attributes= await alchemy.nft.computeRarity(address, tokenId);
    const attributes: NftAttributeRarity[] = [
      {
        traitType: "Background",
        value: "Green Orange",
        prevalence: 0.0303,
      },
      {
        traitType: "Skin Tone",
        value: "Medium Gold",
        prevalence: 0.0294,
      },
      {
        traitType: "Eyes",
        value: "Green To The Left",
        prevalence: 0.0128,
      },
      {
        traitType: "Facial Features",
        value: "Freckles",
        prevalence: 0.0189,
      },
      {
        traitType: "Hairstyle",
        value: "Boy Cut",
        prevalence: 0.017,
      },
      {
        traitType: "Clothes",
        value: "Tunic",
        prevalence: 0.0062,
      },
      {
        traitType: "Earrings",
        value: "Spikes",
        prevalence: 0.0249,
      },
      {
        traitType: "Mouth",
        value: "Slight Smile",
        prevalence: 0.0547,
      },
      {
        traitType: "Lips Color",
        value: "Purple",
        prevalence: 0.0619,
      },
    ];

    const ownersResponse = await alchemy.nft.getOwnersForNft(address, tokenId);

    const owners: { nickname: string; address: string }[] = await db.query({
      sql: "SELECT nickname, address FROM accounts WHERE address IN (?);",
      values: [ownersResponse.owners],
    });

    console.log(
      "metadata.contract.contractDeployer:",
      metadata.contract.contractDeployer
    );
    const deployer: { nickname: string; address: string }[] = await db.query({
      sql: "SELECT nickname, address FROM accounts WHERE address = ?;",
      values: [metadata.contract.contractDeployer],
    });

    data = {
      ...metadata,
      attributes,
      owners: owners[0] ?? {
        nickname: "",
        address: ownersResponse.owners[0],
      },
      deployer: deployer[0] ?? {
        nickname: "",
        address: metadata.contract.contractDeployer ?? "testDeployer",
      },
    };
  }

  const res: APIResponse = { pass, message, data };

  return NextResponse.json(res);
}
