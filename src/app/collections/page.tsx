"use client";

import BoxPageIntro from "@/components/boxes/BoxPageIntro";
import BoxWhite from "@/components/boxes/BoxWhite";
import Button from "@/components/buttons/Button";
import ContainerNFTCollections from "@/components/containers/ContainerNFTCollections";

function CollectionsIndex() {
  const openConfirmModal = () => {
    console.log("openConfirmModal");
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
        <ContainerNFTCollections />
      </BoxWhite>
    </>
  );
}

export default CollectionsIndex;
