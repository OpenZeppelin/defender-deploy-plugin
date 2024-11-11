import type { CompilationFileSources, CompilationResult, SourceWithTarget } from "@remixproject/plugin-api";
import type { ApprovalProcess, ApprovalProcessType, Credentials } from "./defender";

export type DropdownItem = {
  label: string;
  value: any;
}

export type GlobalState = {
  authenticated: boolean;
  error?: string;
  successMessage?: string;
  credentials: Credentials;
  networks: string[];
  approvalProcesses: ApprovalProcess[];
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
    }
    approvalType?: ApprovalProcessType;
  };
};