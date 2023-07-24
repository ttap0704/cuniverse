import { useMutation, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEY as user_query_key } from "./useAccountQuery";

const fetcher = () => {
  return new Promise(async (resolve) => {
    if (localStorage.getItem("web3-token")) {
      localStorage.removeItem("web3-token");
      resolve(true);
    } else {
      resolve(false);
    }
  });
};

const useAccountLogoutMutation = () => {
  const query_client = useQueryClient();

  return useMutation(fetcher, {
    onSuccess: async (res) => {
      query_client.invalidateQueries([user_query_key]);
      if (res) location.reload();
    },
  });
};

export default useAccountLogoutMutation;
