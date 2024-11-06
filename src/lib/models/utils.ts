import type { ApprovalProcess, Credentials } from "./defender";

export type DropdownItem = {
  label: string;
  value: any;
}

export type GlobalState = {
  authenticated: boolean;
  credentials: Credentials;
  networks: string[];
  approvalProcesses: ApprovalProcess[];
  form: {
    network?: string;
    approvalProcess?: ApprovalProcess;
    approvalProcessToCreate?: {
      viaType: string;
      via?: string;
    }
    useInjectedProvider: boolean;
  };
};