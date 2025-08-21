import { TSupportedFunctionName } from '../core';
import { PredefinedOperation } from '../core/base-operation.abstract';
import { ArrayWorkflowMapper } from '../mappers/array-workflow-mapper';
import { TNvSearchPeopleParams, TNvSearchPeopleResult } from '../types';

export class SalesNavigatorSearchPeople extends PredefinedOperation<
  TNvSearchPeopleParams,
  TNvSearchPeopleResult[]
> {
  protected override readonly functionName: TSupportedFunctionName = 'salesNavigatorSearchPeople';
  protected override readonly mapper = new ArrayWorkflowMapper<
    TNvSearchPeopleParams,
    TNvSearchPeopleResult
  >('nv.searchPeople');
}
