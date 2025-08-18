import { LinkedApiError, type TLinkedApiActionError } from "../types/errors";
import type { TBaseActionParams } from "../types/params";
import type {
  TWorkflowCompletion,
  TWorkflowDefinition,
  TWorkflowResponse,
} from "../types/workflows";

export abstract class BaseMapper<TParams extends TBaseActionParams, TResult> {
  abstract mapRequest(params: TParams): TWorkflowDefinition;
  abstract mapResponse(response: TWorkflowResponse): TMappedResponse<TResult>;

  protected getCompletion(response: TWorkflowResponse): TWorkflowCompletion {
    if (!response.completion) {
      const { failure } = response;
      if (failure) {
        throw new LinkedApiError(failure.reason, failure.message);
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
