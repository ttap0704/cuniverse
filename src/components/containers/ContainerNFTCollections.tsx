"use client";

import useAccountQuery from "@/queries/useAccountQuery";
import LoadingSpinner from "../common/LoadingSpinner";
import useAccountContractsQuery from "@/queries/useAccountContractsQuery";
import BoxNFTCollection from "../boxes/BoxNFTCollection";

interface ContainerNFTCollectionsProps {
  className?: string;
  contracts?: ContractDetail[] | null;
  isLoading: boolean;
}

function ContainerNFTCollections(props: ContainerNFTCollectionsProps) {
  const { className, isLoading, contracts } = props;

  return isLoading ? (
    <LoadingSpinner color="black" />
  ) : (
    <div className={`container-nft-collections ${className ? className : ""}`}>
      {!contracts ? (
        <>No Items</>
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
