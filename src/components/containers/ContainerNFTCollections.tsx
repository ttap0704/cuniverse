"use client";

import useAccountQuery from "@/queries/useAccountQuery";
import BoxWhite from "../boxes/BoxWhite";
import LoadingSpinner from "../common/LoadingSpinner";
import useAccountContractsQuery from "@/queries/useAccountContractsQuery";
import Button from "../buttons/Button";
import BoxNFTCollection from "../boxes/BoxNFTCollection";

function ContainerNFTCollections() {
  const { data: account, isLoading: accountLoading } = useAccountQuery();
  const { data: contracts, isLoading: contractsLoading } =
    useAccountContractsQuery(account?.id);

  return accountLoading || contractsLoading ? (
    <LoadingSpinner color="black" />
  ) : (
    <div className="container-nft-collections">
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
