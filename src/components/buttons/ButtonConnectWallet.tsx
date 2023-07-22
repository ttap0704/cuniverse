"use client";

import { useEffect } from "react";
import ButtonHeader from "./ButtonHeader";
import Web3 from "web3";

function ButtonConnectWallet() {
  function connectWallet() {
    console.log(window.ethereum);
    console.log("connectWallet");
  }

  return <ButtonHeader onClick={connectWallet}>CONNECT WALLET</ButtonHeader>;
}

export default ButtonConnectWallet;
