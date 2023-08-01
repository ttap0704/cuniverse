import { fetchGetCollectorInfo } from "@/utils/api";
import { useQuery } from "@tanstack/react-query";

export const QUERY_KEY = "collector";

const fetcher = (address: string) => fetchGetCollectorInfo(address);

const useCollectorQuery = (address: string) => {
  return useQuery([QUERY_KEY], () => fetcher(address), {
    staleTime: Infinity,
    cacheTime: 0,
  });
};

export default useCollectorQuery;
