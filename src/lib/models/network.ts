/**
 * Network mappings for Defender
 * https://github.com/OpenZeppelin/defender-sdk/blob/main/packages/base/src/utils/network.ts
 */

export interface TenantNetworkResponse {
  tenantNetworkId: string;
  name: string;
  chainId: number;
  networkType: 'private' | 'fork';
  isProduction?: boolean;
}

export const productionNetworks = new Set([
  'arbitrum',
  'arbitrum-nova',
  'aurora',
  'avalanche',
  'base',
  'bsc',
  'celo',
  'fantom',
  'fuse',
  'hedera',
  'japan',
  'linea',
  'mainnet',
  'mantle',
  'matic',
  'matic-zkevm',
  'meld',
  'moonbeam',
  'moonriver',
  'optimism',
  'scroll',
  'unichain',
  'xdai',
  'zksync'
]);

export function isProductionNetwork(network: string | TenantNetworkResponse): boolean {
  if (typeof network === 'string') {
    return productionNetworks.has(network);
  }
  return network.isProduction ?? false;
}

export function getNetworkLiteral(network: string | TenantNetworkResponse): string {
  return typeof network === 'string' ? network : network.name;
}

export const chainIds: { [key in string]: number } = {
  'alfajores': 44787,
  'amoy': 80002,
  'arbitrum': 42161,
  'arbitrum-nova': 42170,
  'arbitrum-sepolia': 421614,
  'aurora': 1313161554,
  'auroratest': 1313161555,
  'avalanche': 43114,
  'base': 8453,
  'base-sepolia': 84532,
  'bsc': 56,
  'bsctest': 97,
  'celo': 42220,
  'fantom': 250,
  'fantomtest': 4002,
  'fuji': 43113,
  'fuse': 122,
  'hedera': 295,
  'hederatest': 296,
  'holesky': 17000,
  'japan': 81,
  'japan-testnet': 10081,
  'linea': 59144,
  'linea-goerli': 59140,
  'linea-sepolia': 59141,
  'mainnet': 1,
  'mantle': 5000,
  'mantle-sepolia': 5003,
  'matic': 137,
  'matic-zkevm': 1101,
  'matic-zkevm-testnet': 1442,
  'meld': 333000333,
  'meld-kanazawa': 222000222,
  'moonbase': 1287,
  'moonbeam': 1284,
  'moonriver': 1285,
  'mumbai': 80001,
  'optimism': 10,
  'optimism-sepolia': 11155420,
  'scroll': 534352,
  'scroll-sepolia': 534351,
  'sepolia': 11155111,
  'sokol': 77,
  'unichain': 130,
  'unichain-sepolia': 1301,
  'x-dfk-avax-chain': 53935,
  'x-dfk-avax-chain-test': 335,
  'x-security-alliance': 888,
  'xdai': 100,
  'zksync': 324,
  'zksync-sepolia': 300,
};



export const chainDisplayNames: { [key in string]: string } = {
  'alfajores': 'Celo Alfajores',
  'amoy': 'Polygon Amoy',
  'arbitrum': 'Arbitrum',
  'arbitrum-nova': 'Arbitrum Nova',
  'arbitrum-sepolia': 'Arbitrum Sepolia',
  'aurora': 'Aurora',
  'auroratest': 'Aurora Testnet',
  'avalanche': 'Avalanche',
  'base': 'Base',
  'base-sepolia': 'Base Sepolia',
  'bsc': 'Binance Smart Chain',
  'bsctest': 'Binance Smart Chain Testnet',
  'celo': 'Celo',
  'fantom': 'Fantom',
  'fantomtest': 'Fantom Testnet',
  'fuji': 'Avalanche Fuji',
  'fuse': 'Fuse',
  'hedera': 'Hedera',
  'hederatest': 'Hedera Testnet',
  'holesky': 'Holesky',
  'japan': 'Japan Open Chain',
  'japan-testnet': 'Japan Open Chain Testnet',
  'linea': 'Linea',
  'linea-sepolia': 'Linea Sepolia',
  'mainnet': 'Ethereum Mainnet',
  'mantle': 'Mantle',
  'mantle-sepolia': 'Mantle Sepolia',
  'matic': 'Polygon',
  'matic-zkevm': 'Polygon ZK-EVM',
  'matic-zkevm-testnet': 'Polygon ZK-EVM Testnet',
  'matic-cardona-zkevm-testnet': 'Polygon Cardona ZK-EVM Testnet',
  'meld': 'Meld',
  'meld-kanazawa': 'Meld Kanazawa',
  'moonbase': 'Moonbase',
  'moonbeam': 'Moonbeam',
  'moonriver': 'Moonriver',
  'mumbai': 'Polygon Mumbai',
  'optimism': 'OP Mainnet',
  'optimism-sepolia': 'OP Sepolia',
  'scroll': 'Scroll',
  'scroll-sepolia': 'Scroll Sepolia',
  'sepolia': 'Sepolia',
  'sokol': 'Sokol',
  'unichain': 'Unichain',
  'unichain-sepolia': 'Unichain Sepolia',
  'x-dfk-avax-chain': 'Avalanche X-DFK',
  'x-dfk-avax-chain-test': 'Avalanche X-DFK Testnet',
  'x-security-alliance': 'X Security Alliance',
  'xdai': 'Gnosis Chain',
  'zksync': 'zkSync',
  'zksync-sepolia': 'zkSync Sepolia',
};