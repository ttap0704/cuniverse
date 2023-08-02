import CollectorsCollections from "./collections/page";

function CollectorsIndex({
  searchParams,
}: {
  searchParams: { address: string };
}) {
  // /collectors == /collectors/collections
  return <CollectorsCollections address={searchParams.address} />;
}

export default CollectorsIndex;
