"use client";

import useMetaMaskQuery from "@/queries/useMetaMaskQuery";
import ButtonHeader from "./ButtonHeader";
import useMetaMaskMutation from "@/queries/useMetaMaskMutation";

function ButtonConnectWallet() {
  const { mutate, isLoading } = useMetaMaskMutation();
  const { data: user } = useMetaMaskQuery();

  if (user)
    return (
      <ButtonHeader className="info" onClick={() => null}>
        {user.balance} ETH
      </ButtonHeader>
    );
  else
    return (
      <ButtonHeader className="info" onClick={mutate}>
        {isLoading ? "CONNECTING" : "CONNECT WALLET"}
      </ButtonHeader>
    );
}

export default ButtonConnectWallet;
