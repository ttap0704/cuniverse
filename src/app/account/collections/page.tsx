"use client";

import BoxNFTPreview from "@/components/boxes/BoxNFTPreview";
import ContainerNFTContents from "@/components/containers/ContainerNFTContents";
import useAccountNFTsQuery from "@/queries/useAccountNFTsQuery";
import useAccountQuery from "@/queries/useAccountQuery";

function AccountCollections() {
  const { data: account } = useAccountQuery();
  const { data: nfts } = useAccountNFTsQuery(account?.id);

  if (!nfts || nfts.ownedNfts.length == 0) {
    return <>No Items</>;
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
