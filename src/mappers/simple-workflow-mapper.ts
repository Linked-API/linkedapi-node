import { TDefaultParameters } from "./base-mapper.abstract";
import { TLinkedApiActionError } from "../types/errors";
import type { TBaseActionParams } from "../types/params";
import type {
  TWorkflowDefinition,
  TWorkflowResponse,
} from "../types/workflows";
import { BaseMapper, TMappedResponse } from "./base-mapper.abstract";

export class SimpleWorkflowMapper<
  TParams extends TBaseActionParams,
  TResult,
> extends BaseMapper<TParams, TResult> {
  private readonly actionType: string;
  private readonly defaultParams: TDefaultParameters;

  constructor({
    actionType,
    defaultParams,
  }: {
    actionType: string;
    defaultParams?: TDefaultParameters;
  }) {
    super();
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

  public mapResponse(response: TWorkflowResponse): TMappedResponse<TResult> {
    const completion = this.getCompletion(response);

    if (Array.isArray(completion)) {
      return {
        data: completion
          .map((action) => action.data)
          .filter(Boolean) as TResult,
        errors: completion
          .map((action) => action.error)
          .filter(Boolean) as TLinkedApiActionError[],
      };
    }

    if (completion.error) {
      return {
        data: undefined,
        errors: [completion.error].filter(Boolean) as TLinkedApiActionError[],
      };
    }

    return {
      data: completion.data as TResult,
      errors: [],
    };
  }
}
