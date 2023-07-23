import { useMutation, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEY as user_query_key } from "./useMetaMaskQuery";
import { Web3 } from "web3";
import { checkNetwork } from "@/utils/tools";
import { NETWORK_SEPOLIA } from "../../constants";

const fetcher = () => {
  return new Promise(async (resolve, reject) => {
    if (window.ethereum) {
      const web3 = new Web3(window.ethereum);

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
          resolve(null);
        }
      }

      try {
        // 메타마스크가 있다면
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        const balance = await web3.eth.getBalance(accounts[0]);
        const wei = web3.utils.fromWei(balance, "ether");

        console.log(accounts, balance, wei, "여기오니");
        resolve({
          address: accounts[0],
          balance: wei.slice(0, 6),
        });
      } catch (err) {
        resolve(null);
      }
    } else {
      // 메타마스크가 없다면
      window.open("https://metamask.io/download/", "_blank");
      resolve(null);
    }
  });
};

const useMetaMaskMutation = () => {
  const query_client = useQueryClient();

  return useMutation(fetcher, {
    onSuccess: async (res) => {
      const user = res as User | null;
      if (user) {
        localStorage.setItem("user", JSON.stringify(user));
        query_client.invalidateQueries([user_query_key]);
      }
    },
  });
};

export default useMetaMaskMutation;
