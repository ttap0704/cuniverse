import { fetchGetNFTMetadata } from "@/utils/api";
import { use } from "react";
import ContainerNFTDetail from "@/components/containers/ContainerNFTDetail";
import WrongApproach from "@/components/common/WrongApproach";

// NFT 상세 페이지
function AssetsIndex({
  searchParams,
}: {
  searchParams: { contract: string; ["token-id"]: string };
}) {
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
