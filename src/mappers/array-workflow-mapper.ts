import { TLinkedApiActionError } from '../types/errors';
import type { TWorkflowCompletion, TWorkflowDefinition } from '../types/workflows';

import { BaseMapper, TMappedResponse } from './base-mapper.abstract';

export class ArrayWorkflowMapper<TParams, TResult> extends BaseMapper<TParams, TResult[]> {
  private readonly baseActionType: string;

  constructor(baseActionType: string) {
    super();
    this.baseActionType = baseActionType;
  }

  public mapRequest(params: TParams): TWorkflowDefinition {
    return {
      actionType: this.baseActionType,
      ...params,
    } as unknown as TWorkflowDefinition;
  }

  public mapResponse(completion: TWorkflowCompletion): TMappedResponse<TResult[]> {
    if (Array.isArray(completion)) {
      return {
        data: completion.map((item) => item.data) as TResult[],
        errors: completion.map((item) => item.error).filter(Boolean) as TLinkedApiActionError[],
      };
    }

    if (completion.error) {
      return {
        data: undefined,
        errors: [completion.error].filter(Boolean) as TLinkedApiActionError[],
      };
    }

    const data = completion.data;

    if (Array.isArray(data)) {
      return {
        data: data as TResult[],
        errors: [],
      };
    }

    return {
      data: [data] as TResult[],
      errors: [],
    };
  }
}
