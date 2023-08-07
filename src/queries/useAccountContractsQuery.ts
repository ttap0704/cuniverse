import { fetchGetAccountContracts } from "@/utils/api";
import { useQuery } from "@tanstack/react-query";

export const QUERY_KEY = "account-contracts";

const fetcher = () => fetchGetAccountContracts();

const useAccountContractsQuery = (accountId: number | undefined) => {
  return useQuery([QUERY_KEY], fetcher, {
    staleTime: Infinity,
    cacheTime: 0,
    enabled: accountId !== undefined,
  });
};

export default useAccountContractsQuery;
