#!/usr/bin/env node

import { existsSync, mkdirSync, copyFileSync } from 'fs';

// Copy chainList.json from Superchain Registry
const targetDir = 'src/lib/generated/superchain-registry';
if (!existsSync(targetDir)) {
  mkdirSync(targetDir, { recursive: true });
}
copyFileSync('node_modules/superchain-registry/chainList.json', `${targetDir}/chainList.json`);
