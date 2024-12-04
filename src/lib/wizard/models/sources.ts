

export interface ContractSources {
  target: string;
  sources: SolcInputSources;
}

export interface SolcInputSources {
  [source: string]: {
    content: string;
  };
}