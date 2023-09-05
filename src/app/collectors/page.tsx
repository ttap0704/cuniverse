import CollectorsCollections from "./collections/page";

export const revalidate = 60;

function CollectorsIndex({
  searchParams,
}: {
  searchParams: { address: string };
}) {
  // /collectors == /collectors/collections
  return <CollectorsCollections searchParams={searchParams} />;
}

export default CollectorsIndex;
