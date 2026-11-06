import { Operation, TOperationName } from '../core';
import { VoidWorkflowMapper } from '../mappers';
import { TNvDeleteSavedSearchParams } from '../types';

/** Delete an owned saved search by its string ID. An absent search returns savedSearchNotFound. English interface only. */
export class NvDeleteSavedSearch extends Operation<TNvDeleteSavedSearchParams, void> {
  public override readonly operationName: TOperationName = 'nvDeleteSavedSearch';
  protected override readonly mapper = new VoidWorkflowMapper<TNvDeleteSavedSearchParams>(
    'nv.deleteSavedSearch',
  );
}
