"use client";

import useAccountQuery from "@/queries/useAccountQuery";
import BoxWhite from "../boxes/BoxWhite";
import LoadingSpinner from "../common/LoadingSpinner";
import useAccountContractsQuery from "@/queries/useAccountContractsQuery";
import Button from "../buttons/Button";

function ContainerNFTCollections() {
  const { data: account } = useAccountQuery();
  const { data: contracts, isLoading } = useAccountContractsQuery(account?.id);

  if (!contracts) return <>No Items</>;

  return isLoading ? (
    <LoadingSpinner />
  ) : (
    <div className="container-nft-collections">
      {contracts.map((contract) => {
        return <div key={`contract-${contract.id}`}>{contract.name}</div>;
      })}
    </div>
  );
}

export default ContainerNFTCollections;
