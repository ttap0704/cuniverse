import { fetchGetAccountNFTs } from "@/utils/api";
import { useQuery } from "@tanstack/react-query";

export const QUERY_KEY = "account-nfts";

const fetcher = () => fetchGetAccountNFTs();

const useAccountNFTsQuery = (accountId: number | undefined) => {
  return useQuery([QUERY_KEY], fetcher, {
    staleTime: Infinity,
    cacheTime: 0,
    enabled: accountId !== undefined,
  });
};

export default useAccountNFTsQuery;
