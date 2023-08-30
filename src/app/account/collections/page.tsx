"use client";

import BoxNFTPreview from "@/components/boxes/BoxNFTPreview";
import BoxNotice from "@/components/boxes/BoxNotice";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import ContainerNFTContents from "@/components/containers/ContainerNFTContents";
import ModalConfirm from "@/components/modals/ModalConfirm";
import ModalSaleNFT from "@/components/modals/ModalSaleNFT";
import useAccountNFTsQuery from "@/queries/useAccountNFTsQuery";
import useAccountQuery from "@/queries/useAccountQuery";
import useAccountSalesUpdateMutation from "@/queries/useAccountSalesUpdateMutation";
import useEtherPriceQuery from "@/queries/useEtherPriceQuery";
import { setModalAlertAtom } from "@/store/modalAlert";
import { ipfsToHttps } from "@/utils/tools";
import { useSetAtom } from "jotai";
import { useState } from "react";

function AccountCollections() {
  const { data: account, isLoading: accountLoading } = useAccountQuery();
  const { data: nfts, isLoading: nftsLoading } = useAccountNFTsQuery(
    account?.id
  );
  const { isLoading: priceLoading } = useEtherPriceQuery();
  const { mutate: updateNFTSales } = useAccountSalesUpdateMutation();

  const setModalAlert = useSetAtom(setModalAlertAtom);

  const [cancelModalOpen, setCancelModalOpen] = useState(false);
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
    setSaleNFTItem({
      image: item.image ? ipfsToHttps(item.image) : "/",
      name: item.name ?? "",
      contractName,
      contractAddress,
      tokenId: item.tokenId,
    });

    if (item.price === undefined) {
      setSaleModalOpen(true);
    } else {
      setCancelModalOpen(true);
    }
  };

  const cancelSale = async () => {
    if (account) {
      await updateNFTSales(
        {
          data: {
            accountId: account.id,
            contractAddress: saleNFTItem.contractAddress,
            tokenId: saleNFTItem.tokenId,
            canceledAt: new Date().getTime(),
          },
        },
        {
          onSuccess(res) {
            if (res) {
              setModalAlert({
                type: "success",
                text: "NFT 판매가 취소되었습니다.",
                open: true,
              });
              setCancelModalOpen(false);
            } else {
              setModalAlert({
                type: "error",
                text: "NFT 취소 처리가 실패하였습니다.\n다시 시도해주세요.",
                open: true,
              });
            }
          },
        }
      );
    }
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
        <ModalConfirm
          title="판매 취소"
          buttonText="취소하기"
          onConfirm={cancelSale}
          onClose={() => setCancelModalOpen(false)}
          open={cancelModalOpen}
          useLoading={true}
        >
          <p className="confirm-text">
            NFT 판매를 취소하시겠습니까?
            <br />
            취소 후, 판매하기 버튼을 통해 재판매가 가능합니다.
          </p>
        </ModalConfirm>
      </>
    );
  }
}

export default AccountCollections;
