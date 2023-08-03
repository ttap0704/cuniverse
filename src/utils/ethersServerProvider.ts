import { JsonRpcProvider } from "ethers";

const ethersServerProvider = new JsonRpcProvider(
  `https://sepolia.infura.io/v3/${process.env.NEXT_PUBLIC_SEPOLIA_INFURA_API_KEY}`
);

export default ethersServerProvider;
