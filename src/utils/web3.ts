import Web3 from "web3";

// Web3 환경 설정

let web3: Web3;

// Server Side에서는 window가 없기 때문에
// Production 여부에 따라 환경 설정
if (typeof window !== "undefined" && window.ethereum) {
  web3 = new Web3(window.ethereum);
} else {
  web3 = new Web3(
    `https://sepolia.infura.io/v3/${process.env.NEXT_PUBLIC_SEPOLIA_INFURA_API_KEY}`
  );
}

export default web3;
