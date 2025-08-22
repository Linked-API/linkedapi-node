import { PredefinedOperation, TOperationName } from '../core';
import { ArrayWorkflowMapper } from '../mappers/array-workflow-mapper';
import { TSearchPeopleParams, TSearchPeopleResult } from '../types';

export class SearchPeople extends PredefinedOperation<TSearchPeopleParams, TSearchPeopleResult[]> {
  protected override readonly functionName: TOperationName = 'searchPeople';
  protected override readonly mapper = new ArrayWorkflowMapper<
    TSearchPeopleParams,
    TSearchPeopleResult
  >('st.searchPeople');
}
