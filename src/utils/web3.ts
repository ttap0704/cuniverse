import Web3 from "web3";

let web3: Web3;
if (typeof window !== "undefined" && window.ethereum) {
  web3 = new Web3(window.ethereum);
} else {
  web3 = new Web3(
    `https://sepolia.infura.io/v3/${process.env.NEXT_PUBLIC_SEPOLIA_INFURA_API_KEY}`
  );
}

export default web3;
