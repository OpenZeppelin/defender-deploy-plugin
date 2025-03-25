import { type Eip1193Provider, BrowserProvider, ContractFactory } from 'ethers';
import { type NetworkResponse, type TenantNetworkResponse } from "$lib/models/network";
import type { DeployContractResult } from '$lib/models/ethereum';
import { log } from '$lib/remix/logger';

function getEthereum(): Eip1193Provider {
  if (!window.ethereum) throw new Error('Injected provider not found');
  return window.ethereum;
}

/**
 * Switches the user's wallet to the target network.
 * 
 * @param network target network to switch to.
 */
export async function switchToNetwork(network: NetworkResponse | TenantNetworkResponse) {
  if (!network.chainId) throw new Error(`Invalid network: ${network}`);

  const ethereum = getEthereum();

  // ignore if user is already connected to target network.
  const current = await ethereum.request({ method: 'eth_chainId' });
  if (parseInt(current, 16) === network.chainId) return;

  log("[Defender Deploy] Switching network...");

  await ethereum.request({
    method: 'wallet_switchEthereumChain',
    params: [{ chainId: `0x${network.chainId.toString(16)}` }],
  });
};

/**
 * 
 * @param deployTxData contract bytecode generated from contract compilation.
 * @returns tx hash
 */
export async function deployContract(deployTxData: string): Promise<DeployContractResult> {
  const ethereum = getEthereum();
  
  await ethereum.request({ method: 'eth_requestAccounts' });

  const provider = new BrowserProvider(ethereum);
  const signer = await provider.getSigner();
  const factory = new ContractFactory([], deployTxData, signer);

  const contract = await factory.deploy();
  const recipt = await contract.deploymentTransaction()?.wait();
  if (!recipt) throw new Error('Deployment transaction failed');

  const contractAddress = await contract.getAddress();
  const senderAddress = await signer.getAddress();

  return {
    hash: recipt.hash,
    address: contractAddress,
    sender: senderAddress,
  };
}