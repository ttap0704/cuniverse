import { fetchGetNFTLogs } from "@/utils/api";
import { useQuery } from "@tanstack/react-query";

export const QUERY_KEY = "nft-logs";

const fetcher = (address: string, tokenId: string) =>
  fetchGetNFTLogs(address, tokenId);

const useNFTLogsQuery = (address: string, tokenId: string) => {
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

export default useNFTLogsQuery;
