import { useMutation, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEY as user_query_key } from "./useAccountQuery";
import { setCookieExpireInClient } from "@/utils/tools";

const fetcher = () => {
  return new Promise(async (resolve) => {
    // 로그아웃 시, Client의 로그인 유지에 필요한 cookies 모두 Expired 처리
    setCookieExpireInClient("login-time");
    setCookieExpireInClient("web3-token");
    setCookieExpireInClient("wallet-address");
    resolve(true);
  });
};

const useAccountLogoutMutation = () => {
  const queryClient = useQueryClient();

  return useMutation(fetcher, {
    onSuccess: async (res) => {
      queryClient.invalidateQueries([user_query_key]);
    },
  });
};

export default useAccountLogoutMutation;
