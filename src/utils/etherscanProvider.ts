import { EtherscanProvider } from "ethers";
import { NETWORK_MAINNET } from "../../constants";

const etherscanProvider = new EtherscanProvider(
  NETWORK_MAINNET,
  process.env.ETHERSCAN_API_KEY
);

export default etherscanProvider;
