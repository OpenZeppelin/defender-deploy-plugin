import solc from 'solc';

import type { ContractSources } from "$lib/models/solc";
import type { CompilerInput } from "$lib/models/solc";

export class SolidityCompiler {
  getContent(path: string, contents: ContractSources) {
    if (contents[path]) {
      return contents[path];
    }
    return { error: 'File not found' };
  }
  
  compile(input: CompilerInput, contents?: ContractSources) {
    const shouldFindImports = contents !== undefined;
    const findImports = (path: string) => shouldFindImports ? this.getContent(path, contents) : undefined;
    const output = solc.compile(JSON.stringify(input), shouldFindImports ? { import: findImports } : undefined);
    return output;
  }
}
