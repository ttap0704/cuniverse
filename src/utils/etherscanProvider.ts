import { EtherscanProvider } from "ethers";
import { NETWORK_SEPOLIA } from "../../constants";

const etherscanProvider = new EtherscanProvider(
  NETWORK_SEPOLIA,
  process.env.ETHERSCAN_API_KEY
);

export default etherscanProvider;
