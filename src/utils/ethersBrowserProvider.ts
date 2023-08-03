import { BrowserProvider } from "ethers";

const ethersBrowserProvider = {
  provider:
    typeof window !== "undefined" && window.ethereum
      ? new BrowserProvider(window.ethereum)
      : null,
  changeNetwork() {
    this.provider = new BrowserProvider(window.ethereum);
  },
};

export default ethersBrowserProvider;
