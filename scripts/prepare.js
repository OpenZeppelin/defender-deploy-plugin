#!/usr/bin/env node

import { existsSync, mkdirSync, copyFileSync, writeFileSync } from 'fs';
import { createRequire } from 'module';

const GENERATED_DIR = 'src/lib/generated';

async function main() {
  createDirs(GENERATED_DIR);

  copySuperchainRegistry();
  copySolcVersion();
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});

function createDirs(dir) {
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
}

function copySuperchainRegistry() {
  copyFileSync('node_modules/superchain-registry/chainList.json', `${GENERATED_DIR}/superchainRegistryChainList.json`);
}

function copySolcVersion() {
  const { version } = createRequire(import.meta.url)('solc/package.json');
  writeFileSync(`${GENERATED_DIR}/solcVersion.json`, JSON.stringify({ version }, null, 2));
}