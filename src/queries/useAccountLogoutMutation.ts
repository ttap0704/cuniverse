import { useMutation, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEY as user_query_key } from "./useAccountQuery";
import { setCookieExpireInClient } from "@/utils/tools";

const fetcher = () => {
  return new Promise(async (resolve) => {
    setCookieExpireInClient("web3-token");
    setCookieExpireInClient("wallet-address");
    resolve(true);
  });
};

const useAccountLogoutMutation = () => {
  const query_client = useQueryClient();

  return useMutation(fetcher, {
    onSuccess: async (res) => {
      query_client.invalidateQueries([user_query_key]);
    },
  });
};

export default useAccountLogoutMutation;
