import BoxNotice from "@/components/boxes/BoxNotice";
import BoxWhite from "@/components/boxes/BoxWhite";
import ContainerNFTCollections from "@/components/containers/ContainerNFTCollections";
import { fetchGetCollectorsContracts } from "@/utils/api";
import { use } from "react";

function CollectorsCreations({
  searchParams,
}: {
  searchParams: { address: string };
}) {
  const contracts = use(fetchGetCollectorsContracts(searchParams.address));

  if (!contracts || contracts.length == 0) {
    return <BoxNotice text="No Items" />;
  } else {
    return (
      <>
        <BoxWhite>
          <ContainerNFTCollections isLoading={false} contracts={contracts} />
        </BoxWhite>
      </>
    );
  }
}

export default CollectorsCreations;
