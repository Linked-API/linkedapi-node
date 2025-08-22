import { TLinkedApiActionError } from '../types/errors';
import type { TWorkflowCompletion, TWorkflowDefinition } from '../types/workflows';

import { TDefaultParameters } from './base-mapper.abstract';
import { BaseMapper, TMappedResponse } from './base-mapper.abstract';

export class SimpleWorkflowMapper<TParams, TResult> extends BaseMapper<TParams, TResult> {
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

  public mapResponse(completion: TWorkflowCompletion): TMappedResponse<TResult> {
    if (Array.isArray(completion)) {
      return {
        data: completion.map((action) => action.data).filter(Boolean) as TResult,
        errors: completion.map((action) => action.error).filter(Boolean) as TLinkedApiActionError[],
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
