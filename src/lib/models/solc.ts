export type CompilerInput = {
  /**
   * The language, currently only Solidity is supported.
   */
  language: string;
  /**
   * Name of the file and the content of the file.
   * e.g. { 'test.sol': { content: 'contract C { function f() public { L.f(); } }' } }
   */
  sources: ContractSources;
  /**
   * Settings for the compiler.
   * e.g. { outputSelection: { '*': { '*': ['*'] } }"
   */
  settings: {
    outputSelection: Record<string, Record<string, string[]>>;
    optimizer?: {
      enabled: boolean,
      runs: number,
    },
  };
};

export type ImportContents = Record<string, { contents: string }>

export type ContractSources = {
  [source: string]: { content: string };
};

export function buildCompilerInput(sources: ContractSources): CompilerInput {
  return {
    sources,
    language: 'Solidity',
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
      outputSelection: {
        '*': { '*': ['*'] }
      }
    }
  };
}

