import { fetchGetNFTMetadata } from "@/utils/api";
import { use } from "react";
import ContainerNFTDetail from "@/components/containers/ContainerNFTDetail";
import WrongApproach from "@/components/common/WrongApproach";

function AssetsIndex({
  searchParams,
}: {
  searchParams: { contract: string; tokenId: string };
}) {
  const address = searchParams["contract"];
  const tokenId = searchParams["tokenId"];

  const data = use(fetchGetNFTMetadata(address, tokenId));

  if (!data) {
    return <WrongApproach />;
  } else {
    return <ContainerNFTDetail {...data}></ContainerNFTDetail>;
  }
}

export default AssetsIndex;
