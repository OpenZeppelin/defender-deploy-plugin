import solc from 'solc';
import type { CompilerInput } from "$lib/models/solc";

export class SolidityCompiler {
  compile(input: CompilerInput) {
    return solc.compile(JSON.stringify(input));
  }
}
