import { Operation, TOperationName } from '../core';
import { BaseMapper, TMappedResponse } from '../mappers';
import { TWorkflowCompletion, TWorkflowDefinition } from '../types';

export class CustomWorkflow extends Operation<TWorkflowDefinition, TWorkflowCompletion> {
  protected readonly operationName: TOperationName = 'customWorkflow';
  protected readonly mapper = new CustomWorkflowMapper();
}

class CustomWorkflowMapper extends BaseMapper<TWorkflowDefinition, TWorkflowCompletion> {
  override mapRequest(params: TWorkflowDefinition): TWorkflowDefinition {
    return params;
  }

  override mapResponse(completion: TWorkflowCompletion): TMappedResponse<TWorkflowCompletion> {
    return {
      data: completion,
      errors: [],
    };
  }
}
