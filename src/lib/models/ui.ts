import type { CompilationFileSources, CompilationResult, SourceWithTarget } from "@remixproject/plugin-api";
import type { Relayer } from "./relayer";
import type { ApiKeyCapability, Credentials } from "./auth";
import type { ApprovalProcess } from "./approval-process";

export type DropdownItem = {
  label: string;
  value: any;
}

export type GlobalState = {
  authenticated: boolean;
  error?: string;
  successMessage?: string;
  credentials: Credentials;
  permissions: ApiKeyCapability[];
  networks: string[];
  approvalProcesses: ApprovalProcess[];
  relayers: Relayer[];
  contract?: {
    target?: string,
    source?: CompilationFileSources | null | SourceWithTarget,
    version?: string,
    data?: CompilationResult | null,
  }
  form: {
    network?: string;
    approvalProcessSelected?: ApprovalProcess;
    approvalProcessToCreate?: {
      viaType: 'EOA' | 'Safe' | 'Relayer';
      via?: string;
      relayerId?: string;
    }
    approvalType?: 'existing' | 'new' | 'injected';
    completed?: boolean;
  };
};

export type APIResponse<T> = {
  success: boolean;
  error?: string;
  data?: T;
}