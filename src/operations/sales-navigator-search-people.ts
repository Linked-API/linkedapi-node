import { PredefinedOperation, TOperationName } from '../core';
import { ArrayWorkflowMapper } from '../mappers/array-workflow-mapper';
import { TNvSearchPeopleParams, TNvSearchPeopleResult } from '../types';

export class SalesNavigatorSearchPeople extends PredefinedOperation<
  TNvSearchPeopleParams,
  TNvSearchPeopleResult[]
> {
  protected override readonly operationName: TOperationName = 'salesNavigatorSearchPeople';
  protected override readonly mapper = new ArrayWorkflowMapper<
    TNvSearchPeopleParams,
    TNvSearchPeopleResult
  >('nv.searchPeople');
}
