import { Operation, TOperationName } from '../core';
import { ArrayWorkflowMapper } from '../mappers/array-workflow-mapper';
import { TNvSearchPeopleParams, TNvSearchPeopleResult } from '../types';

export class NvSearchPeople extends Operation<TNvSearchPeopleParams, TNvSearchPeopleResult[]> {
  protected override readonly operationName: TOperationName = 'nvSearchPeople';
  protected override readonly mapper = new ArrayWorkflowMapper<
    TNvSearchPeopleParams,
    TNvSearchPeopleResult
  >('nv.searchPeople');
}
