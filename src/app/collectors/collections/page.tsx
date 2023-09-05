import BoxNFTPreview from "@/components/boxes/BoxNFTPreview";
import BoxNotice from "@/components/boxes/BoxNotice";
import ContainerNFTContents from "@/components/containers/ContainerNFTContents";
import { fetchGetCollectorNFTs } from "@/utils/api";
import { use } from "react";

export const revalidate = 60;

async function CollectorsCollections({
  searchParams,
}: {
  searchParams: { address: string };
}) {
  const nfts = use(fetchGetCollectorNFTs(searchParams.address));

  if (!nfts || nfts.length == 0) {
    return <BoxNotice text="소유한 NFT가 없습니다." />;
  } else {
    return (
      <ContainerNFTContents>
        {nfts.map((item, itemIdx) => {
          return (
            <BoxNFTPreview
              key={`account_nft_item_${itemIdx}`}
              item={item}
              contractAddress={item.contract ? item.contract.address : ""}
              contractName={item.contract ? item.contract.name : ""}
            />
          );
        })}
      </ContainerNFTContents>
    );
  }
}

export default CollectorsCollections;
