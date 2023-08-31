"use client";

import BoxPageIntro from "@/components/boxes/BoxPageIntro";
import BoxWhite from "@/components/boxes/BoxWhite";
import Button from "@/components/buttons/Button";
import ContainerNFTCollections from "@/components/containers/ContainerNFTCollections";
import ModalConfirmGenerateContract from "@/components/modals/ModalConfirmGenerateContract";
import useAccountContractsQuery from "@/queries/useAccountContractsQuery";
import useAccountQuery from "@/queries/useAccountQuery";
import { useRouter } from "next/navigation";
import { useState } from "react";

function CollectionsIndex() {
  const router = useRouter();

  const { data: account, isLoading: accountLoading } = useAccountQuery();
  const { data: contracts, isLoading: contractsLoading } =
    useAccountContractsQuery(account?.id);

  const [modalOpen, setModalOpen] = useState(false);
  const openConfirmModal = () => {
    setModalOpen(true);
  };

  const closeConfirmModal = () => {
    setModalOpen(false);
  };

  const moveGeneratePage = (mode: string) => {
    closeConfirmModal();
    router.push(`/contracts/generate?mode=${mode}`);
  };

  return (
    <>
      <BoxPageIntro title="내 컬렉션">
        공유할 NFT 컬렉션을 관리합니다. 공유한 컬렉션은 사용자에게 노출 및
        판매가 가능합니다.
      </BoxPageIntro>
      <br />
      <BoxWhite
        style={{
          flexDirection: "column",
          alignItems: "flex-start",
        }}
      >
        <Button onClick={openConfirmModal}>컬렉션 생성</Button>
        <br />
        <ContainerNFTCollections
          isLoading={accountLoading || contractsLoading}
          contracts={contracts}
        />
      </BoxWhite>
      <ModalConfirmGenerateContract
        open={modalOpen}
        onConfirm={moveGeneratePage}
        onClose={closeConfirmModal}
      />
    </>
  );
}

export default CollectionsIndex;
