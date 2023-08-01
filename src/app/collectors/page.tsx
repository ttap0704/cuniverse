import CollectorsCollections from "./collections/page";

function CollectorsIndex({
  searchParams,
}: {
  searchParams: { address: string };
}) {
  return <CollectorsCollections address={searchParams.address} />;
}

export default CollectorsIndex;
