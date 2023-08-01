import { NextRequest, NextResponse } from "next/server";
import alchemy from "@/utils/alchemy";
import { NftAttributeRarity, NftContractNftsResponse } from "alchemy-sdk";
import db from "../db";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.search);
  const address = searchParams.get("address");
  const tokenId = BigInt(Number(searchParams.get("tokenId")));
  let pass = false,
    message = "",
    data: NFTDetail | null = null;

  if (address && tokenId >= 0) {
    const metadata = await alchemy.nft.getNftMetadata(address, tokenId);
    if (
      metadata.rawMetadata &&
      metadata.rawMetadata.image &&
      metadata.rawMetadata.image.includes("ipfs://")
    ) {
      metadata.rawMetadata.image = metadata.rawMetadata.image.replace(
        "ipfs://",
        "https://ipfs.io/ipfs/"
      );
    }

    // 잘못된 콘트랙트 주소로 요청시에는 data = null
    if (metadata.tokenType != "NOT_A_CONTRACT") {
      // const attributes = await alchemy.nft.computeRarity(address, tokenId);
      const attributes: NftAttributeRarity[] = [];

      const ownersResponse = await alchemy.nft.getOwnersForNft(
        address,
        tokenId,
        {}
      );

      // 현재 NFT 소유자 점검
      const owners: { nickname: string; address: string }[] =
        ownersResponse.owners.length > 0
          ? await db.query({
              sql: "SELECT nickname, address FROM accounts WHERE address IN (?);",
              values: [ownersResponse.owners],
            })
          : [];

      // 컨트랙트 배포자 점검
      const deployer: { nickname: string; address: string }[] = await db.query({
        sql: "SELECT nickname, address FROM accounts WHERE address = ?;",
        values: [metadata.contract.contractDeployer],
      });

      // 해당 컬렉션에 소개할 NFTs 가져오기
      const moreNFTsResponse = await alchemy.nft.getNftsForContract(address, {
        pageSize: 10,
      });
      const moreNFTs: NftContractNftsResponse["nfts"] = moreNFTsResponse.nfts;

      // 현재 해당 NFT가 판매중인지 체크
      const saleResponse: { end_time: string; price: number }[] =
        await db.query({
          sql: "SELECT price, end_time FROM sales WHERE contract_address = ? AND token_id = ?;",
          values: [address, tokenId],
        });
      const sale = saleResponse[0] ?? null;

      pass = true;
      data = {
        ...metadata,
        attributes,
        owners: owners[0] ?? {
          nickname: null,
          address: ownersResponse.owners[0],
        },
        deployer: deployer[0] ?? {
          nickname: metadata.contract.contractDeployer ? null : "알 수 없음",
          address: metadata.contract.contractDeployer,
        },
        moreNFTs,
        sale,
      };
    }
  }

  const res: APIResponse = { pass, message, data };

  return NextResponse.json(res);
}
