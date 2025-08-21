import { TSupportedFunctionName } from '../core';
import { PredefinedOperation } from '../core/base-operation.abstract';
import { ArrayWorkflowMapper } from '../mappers/array-workflow-mapper';
import { TSearchPeopleParams, TSearchPeopleResult } from '../types';

export class SearchPeople extends PredefinedOperation<TSearchPeopleParams, TSearchPeopleResult[]> {
  protected override readonly functionName: TSupportedFunctionName = 'searchPeople';
  protected override readonly mapper = new ArrayWorkflowMapper<
    TSearchPeopleParams,
    TSearchPeopleResult
  >('st.searchPeople');
}
