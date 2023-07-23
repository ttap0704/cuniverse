import Web3 from "web3";

// 현재 네트워크가 어디인지 파악
export async function checkNetwork(web3: Web3, targetNetwork: bigint) {
  return (await web3.eth.getChainId()) == targetNetwork;
}
