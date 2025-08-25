import { Operation, TOperationName } from '../core';
import { ArrayWorkflowMapper } from '../mappers/array-workflow-mapper';
import { TSearchPeopleParams, TSearchPeopleResult } from '../types';

export class SearchPeople extends Operation<TSearchPeopleParams, TSearchPeopleResult[]> {
  protected override readonly operationName: TOperationName = 'searchPeople';
  protected override readonly mapper = new ArrayWorkflowMapper<
    TSearchPeopleParams,
    TSearchPeopleResult
  >('st.searchPeople');
}
