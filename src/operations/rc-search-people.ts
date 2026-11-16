import { Operation, TOperationName } from '../core';
import { ArrayWorkflowMapper } from '../mappers';
import { TRcSearchPeopleParams, TRcSearchPeopleResult } from '../types';

export class RcSearchPeople extends Operation<TRcSearchPeopleParams, Array<TRcSearchPeopleResult>> {
  public override readonly operationName: TOperationName = 'rcSearchPeople';
  protected override readonly mapper = new ArrayWorkflowMapper<
    TRcSearchPeopleParams,
    TRcSearchPeopleResult
  >('rc.searchPeople');
}
