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

  // NFT 리스트 로딩처리
  if (accountLoading || nftsLoading) {
    return <LoadingSpinner />;
  }

  if (!nfts || nfts.ownedNfts.length == 0) {
    // 아이템이 없을 때
    return <BoxNotice text="No Items" />;
  } else {
    // 아이템이 있을 때
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
