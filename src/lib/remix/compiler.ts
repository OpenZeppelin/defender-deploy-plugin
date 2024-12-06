import { globalState } from "$lib/state/state.svelte";
import type { PluginClient } from "@remixproject/plugin"
import type { CompilationFileSources, CompilationResult, lastCompilationResult } from "@remixproject/plugin-api";


export async function listenOnCompilerResults(client: PluginClient) {
  client.onload(async () => {
    client.on('solidity', 'compilationFinished', (target, source, version, data) => setOnEventCompilationResult(target, source, version, data));
    const compilationResult = await client.call('solidity', 'getCompilationResult')
    setLastCompilationResult(compilationResult);
  });
}

function setOnEventCompilationResult(target: string, source: CompilationFileSources, version: string, data: CompilationResult) {
  globalState.contract = {
    target,
    source,
    version,
    data,
  }
}

function setLastCompilationResult(compilationResult: lastCompilationResult) {
  globalState.contract = {
    data: compilationResult.data,
    source: compilationResult.source,
  }
}