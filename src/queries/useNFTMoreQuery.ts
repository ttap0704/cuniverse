import { fetchGetNFTMore } from "@/utils/api";
import { useQuery } from "@tanstack/react-query";

export const QUERY_KEY = "more-nft";

const fetcher = (address: string, tokenId: string) =>
  fetchGetNFTMore(address, tokenId);

const useNFTMoreQuery = (address: string, tokenId: string) => {
  return useQuery(
    [QUERY_KEY, address, tokenId],
    () => fetcher(address, tokenId),
    {
      staleTime: Infinity,
      cacheTime: 0,
      refetchOnMount: false,
      retry: 0,
      enabled: address !== undefined && tokenId !== undefined,
    }
  );
};

export default useNFTMoreQuery;
