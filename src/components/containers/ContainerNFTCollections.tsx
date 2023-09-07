"use client";

import LoadingSpinner from "../common/LoadingSpinner";
import BoxNFTCollection from "../boxes/BoxNFTCollection";
import BoxNotice from "../boxes/BoxNotice";
import containerStyles from "@/css/components/containers.module.scss";

interface ContainerNFTCollectionsProps {
  className?: string;
  contracts?: ContractDetail[] | null;
  isLoading: boolean;
}

function ContainerNFTCollections(props: ContainerNFTCollectionsProps) {
  const { isLoading, contracts } = props;
  const className = props.className ?? "";

  return isLoading ? (
    <LoadingSpinner color="black" />
  ) : (
    <div
      className={`${containerStyles["container-nft-collections"]} ${className}`}
    >
      {!contracts || contracts.length == 0 ? (
        <BoxNotice text="등록된 컬렉션이 없습니다." />
      ) : (
        contracts.map((contract) => {
          return (
            <BoxNFTCollection key={`contract-${contract.id}`} {...contract} />
          );
        })
      )}
    </div>
  );
}

export default ContainerNFTCollections;
