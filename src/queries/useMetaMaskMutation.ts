import { useMutation, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEY as accountQueryKey } from "./useAccountQuery";
import { Web3 } from "web3";
import Web3Token from "web3-token";
import { checkNetwork, setCookieInClient } from "@/utils/tools";
import { NETWORK_SEPOLIA } from "../../constants";
import web3 from "@/utils/web3";

const fetcher = () => {
  return new Promise(async (resolve) => {
    if (window.ethereum) {
      // Current Network == Target Network 확인
      const checking = await checkNetwork(web3, NETWORK_SEPOLIA);
      if (!checking) {
        try {
          // 네트워크 변경 로직
          await window.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: web3.utils.toHex(NETWORK_SEPOLIA) }],
          });
        } catch (err) {
          // 사용자가 네트워크 변경을 하지않는다면 에러 발생
          // null 처리
          resolve(false);
        }
      }

      try {
        // 메타마스크가 있다면
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        const address: string = accounts[0];

        // Web3 Sign은 EIP-4361
        const token = await Web3Token.sign(
          (msg: string) => web3.eth.personal.sign(msg, address, ""),
          "1d"
        );

        const cookieExpires = new Date(
          new Date().getTime() + 1000 * 60 * 60 * 24
        );
        setCookieInClient("web3-token", token, cookieExpires);
        setCookieInClient("wallet-address", address, cookieExpires);

        resolve(true);
      } catch (err) {
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
