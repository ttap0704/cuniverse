import { NextRequest, NextResponse } from "next/server";
import db from "../db";
import web3 from "@/utils/web3";
import { NftContractNftsResponse } from "alchemy-sdk";
import alchemy from "@/utils/alchemy";

export async function GET(request: NextRequest, response: NextResponse) {
  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.search);
  const address = searchParams.get("address");
  const tokenId = BigInt(Number(searchParams.get("tokenId")));
  let pass = false,
    message = "",
    data: NFTDetail | null = null;

  if (address && tokenId >= 0) {
    const getAbi = await fetch(
      `https://api-sepolia.etherscan.io/api?module=contract&action=getabi&address=${address}&apikey=${process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY}`
    );
    const abiRespoonse: { status: string; message: string; result: string } =
      await getAbi.json();
    if (abiRespoonse.message == "OK") {
      const contract = new web3.eth.Contract(
        JSON.parse(abiRespoonse.result),
        address
      );

      const contractName: string = await contract.methods.name().call();
      let metadataUrl: string = await contract.methods.tokenURI(tokenId).call();
      if (metadataUrl.includes("ipfs://")) {
        metadataUrl = metadataUrl.replace("ipfs://", "https://ipfs.io/ipfs/");
      }

      const metadataResponse = await fetch(`${metadataUrl}`);
      const metadata: NFTMetadata = await metadataResponse.json();

      if (metadata && metadata.image && metadata.image.includes("ipfs://")) {
        metadata.image = metadata.image.replace(
          "ipfs://",
          "https://ipfs.io/ipfs/"
        );
      }

      const owner = await contract.methods.ownerOf(tokenId).call();
      const getDeployer = await fetch(
        `https://api-sepolia.etherscan.io/api?module=contract&action=getcontractcreation&contractaddresses=${address}&apikey=${process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY}`
      );
      const deployerReponse = await getDeployer.json();

      // 현재 NFT 소유자 점검
      const owners: { nickname: string; address: string }[] = await db.query({
        sql: "SELECT nickname, address FROM accounts WHERE address = ?;",
        values: [owner],
      });

      // 컨트랙트 배포자 점검
      const deployer: { nickname: string; address: string }[] = await db.query({
        sql: "SELECT nickname, address FROM accounts WHERE address = ?;",
        values: [deployerReponse["result"][0]["contractCreator"]],
      });

      // 현재 해당 NFT가 판매중인지 체크
      const saleResponse: { end_time: string; price: number }[] =
        await db.query({
          sql: "SELECT price, end_time FROM sales WHERE contract_address = ? AND token_id = ?;",
          values: [address, tokenId],
        });
      const sale = saleResponse[0] ?? null;

      // 해당 컬렉션에 소개할 NFTs 가져오기
      const moreNFTsResponse = await alchemy.nft.getNftsForContract(address, {
        pageSize: 10,
      });
      const moreNFTs: NftContractNftsResponse["nfts"] = moreNFTsResponse.nfts;

      pass = true;
      data = {
        ...metadata,
        tokenId: `${tokenId}`,
        contract: {
          name: contractName,
          address,
        },
        owners: owners[0] ?? {
          nickname: null,
          address: owner,
        },
        deployer: deployer[0] ?? {
          nickname: deployerReponse["result"][0]["contractCreator"]
            ? null
            : "알 수 없음",
          address: deployerReponse["result"][0]["contractCreator"],
        },
        moreNFTs,
        sale,
      };
    }
  }

  const res: APIResponse = { pass, message, data };

  return NextResponse.json(res);
}
