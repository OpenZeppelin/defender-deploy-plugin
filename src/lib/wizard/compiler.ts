const solc = require('solc');

import type { ImportContents } from "$lib/models/solc";
import type { CompilerInput } from "$lib/models/solc";

export class SolidityCompiler {
  getContent(path: string, contents: Record<string, { contents: string }>) {
    if (contents[path]) {
      return contents[path];
    }
    return { error: 'File not found' };
  }
  
  compile(input: CompilerInput, contents: ImportContents) {
    const findImports = (path: string) => this.getContent(path, contents);
    const output = solc.compile(JSON.stringify(input), { import: findImports });
    return output;
  }
}

export const Compiler = new SolidityCompiler();


