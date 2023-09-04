import { fetchGetNFTMetadata } from "@/utils/api";
import { use } from "react";
import ContainerNFTDetail from "@/components/containers/ContainerNFTDetail";
import WrongApproach from "@/components/common/WrongApproach";
import { Metadata } from "next";
import { CUNIVERSE_METADATA } from "../../../constants";

type AssetsPageProps = {
  searchParams: { contract: string; ["token-id"]: string };
};

export const dynamic = "force-dynamic";

export async function generateMetadata({
  searchParams,
}: AssetsPageProps): Promise<Metadata> {
  const address = searchParams["contract"];
  const tokenId = searchParams["token-id"];

  if (!address || !tokenId) return CUNIVERSE_METADATA;

  const data = await fetchGetNFTMetadata(address, tokenId);

  if (data) {
    return {
      title: data.contract.name + " | Cuniverse",
      description: data.description,
      openGraph: {
        title: data.contract.name + " | Cuniverse",
        description: data.description,
        images: [
          {
            url: data.image ?? "",
            width: 800,
            height: 400,
          },
        ],
        locale: "ko_KR",
        type: "website",
      },
    };
  } else {
    return CUNIVERSE_METADATA;
  }
}

// NFT 상세 페이지
function AssetsIndex({ searchParams }: AssetsPageProps) {
  // Query String으로 address, tokenId 필요
  const address = searchParams["contract"];
  const tokenId = searchParams["token-id"];

  const data = use(fetchGetNFTMetadata(address, tokenId));

  // 불러올 데이터가 없다면
  // Wrong Approach 컴포넌트로 알림
  if (!data) {
    return <WrongApproach />;
  } else {
    return <ContainerNFTDetail {...data}></ContainerNFTDetail>;
  }
}

export default AssetsIndex;
