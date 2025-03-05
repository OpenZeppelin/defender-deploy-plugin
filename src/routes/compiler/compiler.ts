import solc from 'solc';

import type { CompiledContract, CompilerInput , ImportContents} from "$lib/models/solc";

export class SolidityCompiler {
  private getContentIfExist = (path: string, contents: ImportContents) =>
    contents?.[path] ?? { error: 'File not found' };

  private findImports = (contents?: ImportContents) => (path: string) =>
    contents ? this.getContentIfExist(path, contents) : undefined;

  private doCompile = (contractToCompile: CompilerInput, importContents?: ImportContents): CompiledContract => {
    const shouldUseFindImports = importContents !== undefined;

    const compiledContracts = solc.compile(JSON.stringify(contractToCompile), shouldUseFindImports ? { import: this.findImports(importContents) } : undefined)

    return JSON.parse(compiledContracts)
  }
  
  compile(contractToCompile: CompilerInput, importContents?: ImportContents) {
    const compiledContracts = this.doCompile(contractToCompile, importContents)

    return JSON.stringify(compiledContracts);
  }
}
