import type { CompilationFileSources, CompilationResult, SourceWithTarget } from "@remixproject/plugin-api";
import type { Relayer } from "./relayer";
import type { ApiKeyCapability, Credentials } from "./auth";
import type { ApprovalProcess } from "./approval-process";
import type { TenantNetworkResponse } from "./network";

export type DropdownItem = {
  label: string;
  value: any;
  group?: string;
}

export type GlobalState = {
  authenticated: boolean;
  error?: string;
  successMessage?: string;
  credentials: Credentials;
  permissions: ApiKeyCapability[];
  networks: string[] | TenantNetworkResponse[];
  approvalProcesses: ApprovalProcess[];
  relayers: Relayer[];
  contract?: {
    target?: string,
    source?: CompilationFileSources | null | SourceWithTarget,
    version?: string,
    data?: CompilationResult | null,
    enforceDeterministicReason?: string,
  }
  form: {
    network?: string | TenantNetworkResponse;
    approvalProcessSelected?: ApprovalProcess;
    approvalProcessToCreate?: {
      viaType: 'EOA' | 'Safe' | 'Relayer';
      via?: string;
      relayerId?: string;
      network?: string;
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