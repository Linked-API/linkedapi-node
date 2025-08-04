import { TDefaultParameters } from "./base-mapper.abstract";
import { LinkedApiWorkflowError } from "../types/errors";
import type { TBaseActionParams } from "../types/params";
import type {
  TWorkflowDefinition,
  TWorkflowResponse,
} from "../types/workflows";
import type { BaseMapper } from "./base-mapper.abstract";

export class SimpleWorkflowMapper<TParams extends TBaseActionParams, TResult>
  implements BaseMapper<TParams, TResult>
{
  private readonly actionType: string;
  private readonly defaultParams: TDefaultParameters;

  constructor({
    actionType,
    defaultParams,
  }: {
    actionType: string;
    defaultParams?: TDefaultParameters;
  }) {
    this.actionType = actionType;
    this.defaultParams = defaultParams ?? {};
  }

  public mapRequest(params: TParams): TWorkflowDefinition {
    return {
      actionType: this.actionType,
      ...this.defaultParams,
      ...params,
    } as unknown as TWorkflowDefinition;
  }

  public mapResponse(response: TWorkflowResponse): TResult {
    if (!response.completion) {
      const { failure } = response;
      if (failure) {
        throw new LinkedApiWorkflowError(failure.reason, failure.message);
      }
      throw LinkedApiWorkflowError.unknownError();
    }

    return response.completion.data as TResult;
  }
}
