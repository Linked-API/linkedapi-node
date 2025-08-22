import { type TLinkedApiActionError } from '../types/errors';
import type { TWorkflowCompletion, TWorkflowDefinition } from '../types/workflows';

export abstract class BaseMapper<TParams, TResult> {
  abstract mapRequest(params: TParams): TWorkflowDefinition;
  abstract mapResponse(completion: TWorkflowCompletion): TMappedResponse<TResult>;
}

export interface TDefaultParameters {
  [key: string]: unknown;
}

export interface TMappedResponse<TResult> {
  data?: TResult;
  errors: TLinkedApiActionError[];
}
