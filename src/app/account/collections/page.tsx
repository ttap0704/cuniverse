"use client";

import BoxNFTPreview from "@/components/boxes/BoxNFTPreview";
import BoxNotice from "@/components/boxes/BoxNotice";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import ContainerNFTContents from "@/components/containers/ContainerNFTContents";
import useAccountNFTsQuery from "@/queries/useAccountNFTsQuery";
import useAccountQuery from "@/queries/useAccountQuery";

function AccountCollections() {
  const { data: account, isLoading: accountLoading } = useAccountQuery();
  const { data: nfts, isLoading: nftsLoading } = useAccountNFTsQuery(
    account?.id
  );

  if (accountLoading || nftsLoading) {
    return <LoadingSpinner />;
  }

  if (!nfts || nfts.ownedNfts.length == 0) {
    return <BoxNotice text="No Items" />;
  } else {
    return (
      <ContainerNFTContents>
        {nfts.ownedNfts.map((item, item_idx) => {
          return (
            <BoxNFTPreview key={`account_nft_item_${item_idx}`} item={item} />
          );
        })}
      </ContainerNFTContents>
    );
  }
}

export default AccountCollections;
