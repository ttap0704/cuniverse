import { useMutation, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEY as accountQueryKey } from "./useAccountQuery";
import { setCookieInClient } from "@/utils/tools";
import { NETWORK_SEPOLIA, SIGN_TEXT } from "../../constants";
import ethersBrowserProvider from "@/utils/ethersBrowserProvider";
import { toBeHex } from "ethers";

const fetcher = () => {
  return new Promise(async (resolve) => {
    if (ethersBrowserProvider.provider) {
      // Current Network == Target Network 확인
      const chainId = (await ethersBrowserProvider.provider.getNetwork())
        .chainId;
      if (chainId !== NETWORK_SEPOLIA) {
        try {
          // 네트워크 변경 로직
          const hexNetworkNumber = toBeHex(NETWORK_SEPOLIA);
          await ethersBrowserProvider.provider.send(
            "wallet_switchEthereumChain",
            [{ chainId: hexNetworkNumber }]
          );
          ethersBrowserProvider.changeNetwork();
        } catch (err) {
          // 사용자가 네트워크 변경을 하지않는다면 에러 발생
          // null 처리
          resolve(false);
          return;
        }
      }

      try {
        const account = await ethersBrowserProvider.provider.getSigner();
        const loginTime = new Date().getTime();
        const signText =
          SIGN_TEXT + new Date(loginTime).toLocaleString("euc-kr");
        const token = await account.signMessage(signText);

        const cookieExpires = new Date(
          new Date().getTime() + 1000 * 60 * 60 * 24
        );
        setCookieInClient("web3-token", token, cookieExpires);
        setCookieInClient("wallet-address", account.address, cookieExpires);
        setCookieInClient("login-time", `${loginTime}`, cookieExpires);

        resolve(true);
      } catch (err) {
        console.log(err);
        resolve(false);
      }
    } else {
      // 메타마스크가 없다면
      window.open("https://metamask.io/download/", "_blank");
      resolve(false);
    }
  });
};

const useMetaMaskMutation = () => {
  const query_client = useQueryClient();

  return useMutation(fetcher, {
    onSuccess: async (res) => {
      if (res) {
        query_client.invalidateQueries([accountQueryKey]);
      }
    },
  });
};

export default useMetaMaskMutation;
