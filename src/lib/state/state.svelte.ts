import type { ApprovalProcess, ApprovalProcessToCreate } from "$lib/models/approval-process";
import type { GlobalState, SelectedApprovalProcessType } from "$lib/models/ui";
import { isDeploymentEnvironment, isSameNetwork } from "$lib/utils/helpers";
import { getAddress } from "ethers";
import { attempt } from "$lib/utils/attempt";
import type { TenantNetworkResponse } from "../models/network";


/**
 * Global application state
 * 
 * For simplicity, we just have a single global state to make the app reactive everywhere
 * if gets complex, we can split this into multiple states, or even stores.
 */
export const globalState = $state<GlobalState>({
  // indicates if user is authenticated.
  authenticated: false,

  // indicates if there was some network error.
  error: undefined,

  // Indicates if there is some success message.
  successMessage: undefined,

  // User credentials.
  credentials: {
    apiKey: '',
    apiSecret: '',
  },

  // API Key capabilites.
  permissions: [],

  // Networks supported by Defender + tenant networks.
  networks: [],

  // Approval processes corresponding to current user
  approvalProcesses: [],

  // Relayers list for approval process creation
  relayers: [],

  contract: {
    // path of the contract
    target: undefined,

    // compilation file sources.
    source: undefined,

    // solidity version
    version: undefined,

    // compilation result
    data: undefined,
  },

  // Current deployment form state.
  form: {
    // Network selected to deploy
    network: undefined,

    // User selected approval process
    approvalProcessSelected: undefined,

    // Approval process to be created and used for deployment.
    approvalProcessToCreate: undefined,

    // Indicates if user is using existing approval process, creating one or injected provider
    approvalType: undefined,

    constructorArguments: {
      values: {},
      required: 0
    },

    deterministic: {
      isSelected: false,
      salt: undefined
    },

    // Indicates if deployment is completed.
    completed: false,
  },
});

export const isValidFormAuthentication = () => globalState.authenticated

const isFormFilledFor = (formInputToCheck: keyof typeof globalState.form) => () => globalState.form[formInputToCheck] !== undefined
export const isValidFormNetwork = isFormFilledFor("network")

export const isValidConstructorArguments = () => Object.keys(globalState.form.constructorArguments.values).length === globalState.form.constructorArguments.required && Object.values(globalState.form.constructorArguments.values).reduce((checkValueResult: boolean, currentValue) => checkValueResult && (currentValue !== undefined && currentValue !== ""), true)

export const isValidDeterministicConfiguration = () => globalState.form.deterministic.isSelected ? globalState.form.deterministic.salt !== undefined : true

export const isValidFormApprovalProcess = async () => {

  if (globalState.form.approvalType === "injected") {
    return true;
  }

  if (globalState.form.approvalType === 'existing' && globalState.form.approvalProcessSelected) {
    return true;
  }

  if (
    globalState.form.approvalType === 'new' &&
    globalState.form.approvalProcessToCreate?.viaType === "Relayer" &&
    globalState.form.approvalProcessToCreate?.relayerId
  ) {
    return true;
  }

  if (
    globalState.form.approvalType === 'new' &&
    globalState.form.approvalProcessToCreate?.viaType !== "Relayer" &&
    globalState.form.approvalProcessToCreate?.via
  ) {

    const checkIfValidAddress = async () =>
      getAddress(globalState.form.approvalProcessToCreate!.via!)
    const [_checkSumed, error] = await attempt(checkIfValidAddress);
    if (error) {
      return false;
    }
    return true;
  }

  return false;
}


export const clearErrorBanner = () => {
  globalState.error = undefined;
};

export const setErrorBanner = (error?: string) => {
  globalState.error = error;
};

export const addApprovalProcessToDropdown = (approvalProcess: ApprovalProcess) => {
  globalState.approvalProcesses.push(approvalProcess);
}

export const addNewApprovalProcessAndSelectExisting = (newApprovalProcess: ApprovalProcess) => {
  addApprovalProcessToDropdown(newApprovalProcess)
  updateSelectedApprovalProcessWithExisting(newApprovalProcess)
}

export const updateSelectedApprovalProcessWithExisting = (approvalProcess: ApprovalProcess) => {
  globalState.form = {
    ...globalState.form,
    approvalType: "existing",
    approvalProcessSelected: {...approvalProcess},
    approvalProcessToCreate: undefined
  }
}

export const setConstructorArgumentValues = (constructorArgumentName: string, constructorArgumentValue: string) => globalState.form.constructorArguments.values[constructorArgumentName] = constructorArgumentValue

export const resetConstructorArgumentValues = () => globalState.form.constructorArguments.values = {}

export const setNumberOfRequiredConstructorArguments = (numberOfRequiredConstructorArguments: number) => globalState.form.constructorArguments.required = numberOfRequiredConstructorArguments

export const setDeterministicSalt = (deterministicSalt: string) => globalState.form.deterministic.salt = deterministicSalt

export const setSelectedApprovalProcess = (selectedApprovalProcess: ApprovalProcess | undefined) => globalState.form.approvalProcessSelected = selectedApprovalProcess ? {...selectedApprovalProcess} : undefined

export const setApprovalProcessToCreate = (approvalProcessToCreate: ApprovalProcessToCreate | undefined) => globalState.form.approvalProcessToCreate = approvalProcessToCreate ? {...approvalProcessToCreate} : undefined

export const setSelectedApprovalProcessType = (approvalProcessType: SelectedApprovalProcessType) => globalState.form.approvalType = approvalProcessType

export const setNetwork = (networkName: string | TenantNetworkResponse) => globalState.form.network = networkName

export function setDeploymentCompleted(completed: boolean) {
  globalState.form.completed = completed;
}

export function findDeploymentEnvironment(via?: string, network?: string) {
  if (!via || !network) return undefined;
  return globalState.approvalProcesses.find((ap) => 
    ap.network &&
    isDeploymentEnvironment(ap) &&
    isSameNetwork(ap.network, network) &&
    ap.via?.toLocaleLowerCase() === via.toLocaleLowerCase()
  );
}