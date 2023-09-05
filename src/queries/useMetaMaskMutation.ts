import { useMutation, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEY as accountQueryKey } from "./useAccountQuery";
import { isMobileDevice, setCookieInClient } from "@/utils/tools";
import { NETWORK_SEPOLIA, SIGN_TEXT } from "../../constants";
import ethersBrowserProvider from "@/utils/ethersBrowserProvider";
import { hashMessage, toBeHex } from "ethers";

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
          SIGN_TEXT +
          new Date(loginTime).toLocaleString("ko-KR", {
            timeZone: "Asia/Seoul",
          });

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
      if (isMobileDevice()) {
        // 모바일 기기일때
        // const dappUrl = window.location.href.split("//")[1].split("/")[0];
        // const metamaskAppDeepLink = "https://metamask.app.link/dapp/" + dappUrl;

        // alert(metamaskAppDeepLink);
        // window.open(metamaskAppDeepLink, "_self");

        // HTTPS만 지원하기 때문에 사용 불가
        // 인증서 작업 이후 모바일 지원 가능
        alert("현재 모바일 기기는 지원하지 않습니다.");
      } else {
        // 메타마스크가 없다면
        window.open("https://metamask.io/download/", "_blank");
        resolve(false);
      }
    }
  });
};

const useMetaMaskMutation = () => {
  const queryClient = useQueryClient();

  return useMutation(fetcher, {
    onSuccess: async (res) => {
      if (res) {
        queryClient.invalidateQueries([accountQueryKey]);
      }
    },
  });
};

export default useMetaMaskMutation;
