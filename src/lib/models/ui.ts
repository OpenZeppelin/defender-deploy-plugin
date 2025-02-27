import type { CompilationFileSources, CompilationResult, SourceWithTarget } from "@remixproject/plugin-api";
import type { Relayer } from "./relayer";
import type { ApiKeyCapability, Credentials } from "./auth";
import type { ApprovalProcess, ApprovalProcessToCreate } from "./approval-process";
import type { TenantNetworkResponse } from "./network";

export type DropdownItem<TValue = any> = {
  label: string;
  value: TValue;
  group?: string;
}

export type HTMLInputExtendedElement<TId = string, TValue = string, TName = string> = HTMLInputElement & { id: TId, name: TName, value: TValue, checked: boolean}
export type HTMLInputElementEvent<TId = string, TValue = string, TName = string> = Event & { currentTarget: HTMLInputExtendedElement<TId, TValue, TName> }


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
    approvalProcessToCreate?: ApprovalProcessToCreate
    approvalType?: SelectedApprovalProcessType;
    constructorArguments: {
      values: Record<string, string | number | boolean>,
      required: number
    }
    deterministic: {
      isSelected: boolean;
      salt?: string
    };
    completed?: boolean;
  },
  clearDeploymentStatus?: () => void;
};

export type APIResponse<T> = {
  success: boolean;
  error?: string;
  data?: T;
}

const selectedApprovalProcessType = ['existing', 'new', 'injected'] as const
export type SelectedApprovalProcessType = typeof selectedApprovalProcessType[number]

export const isSelectedApprovalProcessType = (selectedApprovalProcessType: string): selectedApprovalProcessType is SelectedApprovalProcessType => {
  return selectedApprovalProcessType.includes(selectedApprovalProcessType);
};