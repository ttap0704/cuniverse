import { Alchemy, Network } from "alchemy-sdk";

// Alchemy SDK 환경 설정

const settings = {
  apiKey: process.env.NEXT_PUBLIC_SEPOLIA_ALCHEMY_API_KEY,
  // apiKey: process.env.NEXT_PUBLIC_GOERLI_ALCHEMY_API_KEY,
  // apiKey: process.env.NEXT_PUBLIC_MAINNET_ALCHEMY_API_KEY,
  network: Network.ETH_SEPOLIA,
  // network: Network.ETH_GOERLI,
  // network: Network.ETH_MAINNET,
};

const alchemy = new Alchemy(settings);

export default alchemy;
