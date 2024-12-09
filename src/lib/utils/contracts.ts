import type { ABIDescription, ABIParameter, CompilationResult } from "@remixproject/plugin-api";
import { AbiCoder } from "ethers";
import { attempt } from "./attempt";

export function getContractFeatures(
  path: string,
  compilation: CompilationResult
): { name: string; abi: ABIDescription[] } {
  const contracts = compilation.contracts;
  const contractName =
    Object.keys(contracts[path]).length > 0
      ? Object.keys(contracts[path])[0]
      : "";
  const abi = contracts[path][contractName].abi;
  return { name: contractName, abi };
}

export function getConstructorInputs(
  path: string | undefined,
  compilation: CompilationResult | undefined | null,
): ABIParameter[] {
  // if no compiled contracts found, then return empty inputs.
  if (!compilation || !path) return [];

  const { abi } = getContractFeatures(path, compilation);
  const constructor = abi.find((fragment) => fragment.type === "constructor");
  if (!constructor || !constructor.inputs) return [];
  return constructor.inputs as ABIParameter[];
}

export async function encodeConstructorArgs(
  inputs: ABIParameter[],
  inputsWithValue: Record<string, string | number | boolean>
) {
  return attempt<string>(async () => {
    const abiCoder = new AbiCoder();
    return abiCoder.encode(
      inputs.map((input) => input.type),
      inputs.map((input) => inputsWithValue[input.name])
    );
  });
}

export function createArtifactPayload(
  path: string,
  contractSources: Record<string, any>,
  contracts: Record<string, any>
): string {
  return JSON.stringify({
    input: {
      sources: {
        [path]: { content: contractSources[path].content },
      },
      settings: {
        optimizer: {
          enabled: true,
          runs: 200,
        },
      },
    },
    output: {
      contracts: { ...contracts },
    },
  });
}

export function getContractBytecode(
  path: string,
  contractName: string,
  contractSources: Record<string, any>
): string {
  return contractSources[path][contractName].evm.bytecode.object;
}
