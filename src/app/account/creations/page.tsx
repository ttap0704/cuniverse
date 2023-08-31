"use client";

import BoxWhite from "@/components/boxes/BoxWhite";
import ContainerNFTCollections from "@/components/containers/ContainerNFTCollections";
import useAccountContractsQuery from "@/queries/useAccountContractsQuery";
import useAccountQuery from "@/queries/useAccountQuery";

function AccountCreations() {
  const { data: account, isLoading: accountLoading } = useAccountQuery();
  const { data: contracts, isLoading: contractsLoading } =
    useAccountContractsQuery(account?.id);

  return (
    <>
      <BoxWhite>
        <ContainerNFTCollections
          isLoading={accountLoading || contractsLoading}
          contracts={contracts}
        />
      </BoxWhite>
    </>
  );
}

export default AccountCreations;
