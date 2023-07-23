import { useQuery } from "@tanstack/react-query";

export const QUERY_KEY = "user";

const fetcher = () => {
  const user = localStorage.getItem("user");
  if (user) return JSON.parse(user) as User;
  else return null;
};
const useMetaMaskQuery = () => {
  return useQuery([QUERY_KEY], fetcher, {
    staleTime: Infinity,
  });
};

export default useMetaMaskQuery;
