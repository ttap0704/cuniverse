import { fetchGetCollectorNFTs } from "@/utils/api";
import { useQuery } from "@tanstack/react-query";

export const QUERY_KEY = "collector-nfts";

const fetcher = (address: string) => fetchGetCollectorNFTs(address);

const useCollectorNFTsQuery = (address: string | undefined) => {
  return useQuery([QUERY_KEY], () => fetcher(address as string), {
    staleTime: Infinity,
    cacheTime: 0,
    enabled: typeof address === "string",
  });
};

export default useCollectorNFTsQuery;
