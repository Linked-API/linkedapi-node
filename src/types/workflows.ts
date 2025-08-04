export interface TWorkflowDefinition {
  actionType: string;
  [key: string]: unknown;
}

export type TWorkflowStatus = "running" | "completed" | "failed";

export interface TWorkflowCompletion<
  TResult extends TWorkflowData = TWorkflowData,
> {
  data?: TResult;
  error?: TWorkflowActionError;
  actionType: string;
  success?: boolean;
}

export interface TWorkflowActionError {
  type: string;
  message: string;
}
export interface TWorkflowFailure {
  reason: string;
  message: string;
}

export interface TWorkflowResponse<
  TResult extends TWorkflowData = TWorkflowData,
> {
  workflowId: string;
  workflowStatus: TWorkflowStatus;
  completion?: TWorkflowCompletion<TResult>;
  failure?: TWorkflowFailure;
}

export interface TWorkflowData {
  [key: string]: unknown;
  then?: TThenAction[];
}

export interface TThenAction {
  actionType: string;
  error?: TWorkflowActionError;
  data: TWorkflowData;
  success: boolean;
}
