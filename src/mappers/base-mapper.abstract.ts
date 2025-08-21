import { LinkedApiError, type TLinkedApiActionError, TLinkedApiErrorType } from '../types/errors';
import type {
  TWorkflowCompletion,
  TWorkflowDefinition,
  TWorkflowResponse,
} from '../types/workflows';

export abstract class BaseMapper<TParams, TResult> {
  abstract mapRequest(params: TParams): TWorkflowDefinition;
  abstract mapResponse(response: TWorkflowResponse): TMappedResponse<TResult>;

  protected getCompletion(response: TWorkflowResponse): TWorkflowCompletion {
    if (!response.completion) {
      const { failure } = response;
      if (failure) {
        throw new LinkedApiError(failure.reason as TLinkedApiErrorType, failure.message);
      }
      throw LinkedApiError.unknownError();
    }
    return response.completion;
  }
}

export interface TDefaultParameters {
  [key: string]: unknown;
}

export interface TMappedResponse<TResult> {
  data?: TResult;
  errors: TLinkedApiActionError[];
}
