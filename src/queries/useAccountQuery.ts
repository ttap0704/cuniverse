import { fetchGetAccountInfo } from "@/utils/api";
import { useQuery } from "@tanstack/react-query";

export const QUERY_KEY = "account";

const fetcher = () => fetchGetAccountInfo();

const useAccountQuery = () => {
  return useQuery([QUERY_KEY], fetcher, {
    staleTime: 3000,
    refetchOnWindowFocus: false,
  });
};

export default useAccountQuery;
