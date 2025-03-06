/**
 * Block Explorer Key models (simplified)
 * https://github.com/OpenZeppelin/defender-sdk/blob/main/packages/deploy/src/models/block-explorer.ts
 */
export type BlockExplorerKey = {
  blockExplorerApiKeyId: string;
  network: string;
  keyHash: string;
}