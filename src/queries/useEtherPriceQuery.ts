import { fetchGetEtherPrice } from "@/utils/api";
import { useQuery } from "@tanstack/react-query";

export const QUERY_KEY = "ether-price";

const fetcher = () => fetchGetEtherPrice();

const useEtherPriceQuery = () => {
  return useQuery([QUERY_KEY], fetcher, {
    staleTime: 500000,
    refetchOnMount: false,
  });
};

export default useEtherPriceQuery;
