"use client";

import useAccountQuery from "@/queries/useAccountQuery";
import ButtonHeader from "./ButtonHeader";
import useMetaMaskMutation from "@/queries/useMetaMaskMutation";
import { HiOutlineWallet } from "react-icons/hi2";
import { useEffect } from "react";
import useAccountLogoutMutation from "@/queries/useAccountLogoutMutation";

function ButtonConnectWallet() {
  const { mutate: logout } = useAccountLogoutMutation();
  const { mutate, isLoading } = useMetaMaskMutation();
  const { data: account } = useAccountQuery();

  useEffect(() => {
    if (window.ethereum) {
      // 메타마스크 지갑 계정이 바뀌면 로그아웃 설정
      window.ethereum.on("accountsChanged", logout);
      window.ethereum.on("chainChanged", logout);
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener("accountsChanged", logout);
        window.ethereum.removeListener("chainChanged", logout);
      }
    };
  }, []);

  const handleConnetWallet = () => {
    if (!account) mutate();
  };

  return (
    <ButtonHeader
      testid="header-connect-wallet"
      className="info"
      onClick={handleConnetWallet}
    >
      <HiOutlineWallet />
      {account
        ? `${account.balance} ETH`
        : isLoading
        ? "CONNECTING"
        : "CONNECT WALLET"}
    </ButtonHeader>
  );
}

export default ButtonConnectWallet;
