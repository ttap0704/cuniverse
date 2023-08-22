"use client";

import BoxNFTPreview from "@/components/boxes/BoxNFTPreview";
import BoxNotice from "@/components/boxes/BoxNotice";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import ContainerNFTContents from "@/components/containers/ContainerNFTContents";
import ModalSaleNFT from "@/components/modals/ModalSaleNFT";
import useAccountNFTsQuery from "@/queries/useAccountNFTsQuery";
import useAccountQuery from "@/queries/useAccountQuery";
import useEtherPriceQuery from "@/queries/useEtherPriceQuery";
import { ipfsToHttps } from "@/utils/tools";
import { useState } from "react";

function AccountCollections() {
  const { data: account, isLoading: accountLoading } = useAccountQuery();
  const { data: nfts, isLoading: nftsLoading } = useAccountNFTsQuery(
    account?.id
  );
  const { isLoading: priceLoading } = useEtherPriceQuery();

  const [saleModalOpen, setSaleModalOpen] = useState(false);
  const [saleNFTItem, setSaleNFTItem] = useState<ModalSaleNFTItem>({
    image: "",
    name: "",
    contractName: "",
    contractAddress: "",
    tokenId: "",
  });

  const saleNFT = (
    item: NFTMetadata,
    contractAddress: string,
    contractName: string
  ) => {
    setSaleModalOpen(true);

    setSaleNFTItem({
      image: item.image ? ipfsToHttps(item.image) : "/",
      name: item.name ?? "",
      contractName,
      contractAddress,
      tokenId: item.tokenId,
    });
  };

  // NFT 리스트 로딩처리
  if (accountLoading || nftsLoading || priceLoading) {
    return <LoadingSpinner />;
  }

  if (!nfts || nfts.length == 0) {
    // 아이템이 없을 때
    return <BoxNotice text="No Items" />;
  } else {
    // 아이템이 있을 때
    return (
      <>
        <ContainerNFTContents>
          {nfts.map((item, itemIdx) => {
            return (
              <BoxNFTPreview
                key={`account_nft_item_${itemIdx}`}
                item={item}
                contractAddress={item.contract ? item.contract.address : ""}
                contractName={item.contract ? item.contract.name : ""}
                sale={true}
                onSale={() =>
                  saleNFT(
                    item,
                    item.contract?.address ?? "",
                    item.contract?.name ?? ""
                  )
                }
              />
            );
          })}
        </ContainerNFTContents>
        <ModalSaleNFT
          onClose={() => setSaleModalOpen(false)}
          open={saleModalOpen}
          item={saleNFTItem}
        />
      </>
    );
  }
}

export default AccountCollections;
