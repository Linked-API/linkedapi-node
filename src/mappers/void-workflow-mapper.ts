import { TLinkedApiActionError } from '../types/errors';
import type { TBaseActionParams } from '../types/params';
import type { TWorkflowCompletion, TWorkflowDefinition } from '../types/workflows';

import { BaseMapper, TMappedResponse } from './base-mapper.abstract';

export class VoidWorkflowMapper<TParams extends TBaseActionParams> extends BaseMapper<
  TParams,
  void
> {
  private readonly actionType: string;

  constructor(actionType: string) {
    super();
    this.actionType = actionType;
  }

  public mapRequest(params: TParams): TWorkflowDefinition {
    return {
      actionType: this.actionType,
      ...params,
    } as unknown as TWorkflowDefinition;
  }

  public mapResponse(completion: TWorkflowCompletion): TMappedResponse<void> {
    if (Array.isArray(completion)) {
      return {
        data: undefined,
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
      data: undefined,
      errors: [],
    };
  }
}
