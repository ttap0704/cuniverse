import BoxNotice from "@/components/boxes/BoxNotice";
import BoxWhite from "@/components/boxes/BoxWhite";
import ContainerNFTCollections from "@/components/containers/ContainerNFTCollections";
import { fetchGetCollectorsContracts } from "@/utils/api";
import { use } from "react";

export const revalidate = 60;

async function CollectorsCreations({
  searchParams,
}: {
  searchParams: { address: string };
}) {
  const contracts = use(fetchGetCollectorsContracts(searchParams.address));

  return <ContainerNFTCollections isLoading={false} contracts={contracts} />;
}

export default CollectorsCreations;
