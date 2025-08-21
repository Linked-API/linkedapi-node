import { TLinkedApiActionError } from '../types/errors';

export interface TSingleActionWorkflowDefinition {
  actionType: string;
  [key: string]: unknown;
}

export type TWorkflowDefinition =
  | TSingleActionWorkflowDefinition
  | TSingleActionWorkflowDefinition[];

export type TWorkflowStatus = 'running' | 'completed' | 'failed';

export type TWorkflowCompletion<TResult extends TWorkflowData = TWorkflowData> =
  | TWorkflowCompletionSingleAction<TResult>
  | TWorkflowCompletionSingleAction<TResult>[];

export interface TWorkflowCompletionSingleAction<TResult extends TWorkflowData = TWorkflowData> {
  data?: TResult;
  error?: TLinkedApiActionError;
  actionType: string;
  success: boolean;
  label?: string;
}

export interface TWorkflowFailure {
  reason: string;
  message: string;
}

export interface TWorkflowResponse<TResult extends TWorkflowData = TWorkflowData> {
  workflowId: string;
  workflowStatus: TWorkflowStatus;
  completion?: TWorkflowCompletion<TResult>;
  failure?: TWorkflowFailure;
}

export interface TWorkflowSingleData {
  [key: string]: unknown;
  then?: TThen;
}

export type TWorkflowData = TWorkflowSingleData | TWorkflowSingleData[];

export interface TSingleActionResponse<TResult extends TWorkflowData = TWorkflowData> {
  data?: TResult;
  error?: TLinkedApiActionError;
  actionType: string;
  success: boolean;
  label?: string;
}

export type TActionResponse<TResult extends TWorkflowData = TWorkflowData> =
  TSingleActionResponse<TResult>;

export type TThen<TResult extends TWorkflowData = TWorkflowData> =
  | TActionResponse<TResult>
  | TActionResponse<TResult>[];
