"use client";

import BoxNFTPreview from "@/components/boxes/BoxNFTPreview";
import BoxNotice from "@/components/boxes/BoxNotice";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import ContainerNFTContents from "@/components/containers/ContainerNFTContents";
import useCollectorNFTsQuery from "@/queries/useCollectorNFTsQuery";
import useCollectorQuery from "@/queries/useCollectorQuery";

function CollectorsCollections({ address }: { address: string }) {
  const { data: account, isLoading: accountLoading } =
    useCollectorQuery(address);
  const { data: nfts, isLoading: nftsLoading } = useCollectorNFTsQuery(
    account?.address ?? undefined
  );

  if (accountLoading || nftsLoading) {
    return <LoadingSpinner />;
  }

  if (!nfts || nfts.ownedNfts.length == 0) {
    return <BoxNotice text="No Items" />;
  } else {
    return (
      <ContainerNFTContents>
        {nfts.ownedNfts.map((item, itemIdx) => {
          return (
            <BoxNFTPreview key={`account_nft_item_${itemIdx}`} item={item} />
          );
        })}
      </ContainerNFTContents>
    );
  }
}

export default CollectorsCollections;
