import { type Eip1193Provider, BrowserProvider, ContractFactory } from 'ethers';
import { type NetworkResponse, type TenantNetworkResponse } from "$lib/models/network";
import type { DeployContractResult } from '$lib/models/ethereum';

function getEthereum(): Eip1193Provider {
  if (!window.ethereum) throw new Error('Injected provider not found');
  return window.ethereum;
}

async function getCurrentWalletNetwork() {
  const ethereum = getEthereum();

  try {
    return await ethereum.request({ method: 'eth_chainId' });
  } catch (err) {
    try {
      const netVersion = await ethereum.request({ method: 'net_version' });
      return `0x${parseInt(netVersion as string, 10).toString(16)}`;
    } catch {
      throw new Error(`Error switching network: ${(err as Error).message}`);
    }
  }
}

/**
 * Switches the user's wallet to the target network.
 * 
 * @param network target network to switch to.
 */
export async function switchToNetwork(network: NetworkResponse | TenantNetworkResponse) {
  if (!network.chainId) throw new Error(`Invalid network: ${network}`);

  const ethereum = getEthereum();

  const currentChainIdHex = await getCurrentWalletNetwork()
  if (parseInt(currentChainIdHex, 16) === network.chainId) return;

  try {
    await ethereum.request({
    method: 'wallet_switchEthereumChain',
    params: [{ chainId: `0x${network.chainId.toString(16)}` }],
  });
  } catch {
    throw new Error(`Could not automatically switch to ${network.name}, please ensure tha appropriate network is selected on your wallet (multiple wallet extensions can also prevent proper deployment with injected provider)`)
  }
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