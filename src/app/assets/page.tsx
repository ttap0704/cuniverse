import ContainerNFTDetailIntro from "@/components/containers/ContainerNFTDetailIntro";
import { fetchGetNFTMetadata } from "@/utils/api";
import { use } from "react";
import { DEFAULT_PROFILE } from "../../../constants";

function AssetsIndex({
  searchParams,
}: {
  searchParams: { contract: string; tokenId: string };
}) {
  const address = searchParams["contract"];
  const tokenId = searchParams["tokenId"];

  const data = use(fetchGetNFTMetadata(address, tokenId));

  if (!data) {
    return <div>잘모댄접근</div>;
  } else {
    return (
      <div>
        <ContainerNFTDetailIntro
          deployer={data.deployer}
          contract={{
            address: data.contract.address,
            title: data.contract.name ?? "",
          }}
          image={data.rawMetadata?.image ?? DEFAULT_PROFILE}
          owner={data.owners}
          name={data.rawMetadata?.name ?? data.tokenId}
        />
      </div>
    );
  }
}

export default AssetsIndex;
