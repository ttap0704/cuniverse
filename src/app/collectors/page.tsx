import CollectorsCollections from "./collections/page";

function CollectorsIndex({
  searchParams,
}: {
  searchParams: { address: string };
}) {
  // /collectors == /collectors/collections
  return <CollectorsCollections searchParams={searchParams} />;
}

export default CollectorsIndex;
