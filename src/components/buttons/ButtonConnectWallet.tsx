"use client";

import useMetaMaskQuery from "@/queries/useMetaMaskQuery";
import ButtonHeader from "./ButtonHeader";
import useMetaMaskMutation from "@/queries/useMetaMaskMutation";
import { HiOutlineWallet } from "react-icons/hi2";

function ButtonConnectWallet() {
  const { mutate, isLoading } = useMetaMaskMutation();
  const { data: user } = useMetaMaskQuery();

  const handleConnetWallet = () => {
    if (!user) mutate();
  };

  return (
    <ButtonHeader
      testid="header-connect-wallet"
      className="info"
      onClick={handleConnetWallet}
    >
      <HiOutlineWallet />
      {user
        ? `${user.balance} ETH`
        : isLoading
        ? "CONNECTING"
        : "CONNECT WALLET"}
    </ButtonHeader>
  );
}

export default ButtonConnectWallet;
