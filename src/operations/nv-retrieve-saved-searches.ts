import { Operation, TOperationName } from '../core';
import { ArrayWorkflowMapper } from '../mappers';
import { TNvRetrieveSavedSearchesParams, TNvSavedSearch } from '../types';

/** Retrieve owned saved searches of the requested type. */
export class NvRetrieveSavedSearches extends Operation<
  TNvRetrieveSavedSearchesParams,
  Array<TNvSavedSearch>
> {
  public override readonly operationName: TOperationName = 'nvRetrieveSavedSearches';
  protected override readonly mapper = new ArrayWorkflowMapper<
    TNvRetrieveSavedSearchesParams,
    TNvSavedSearch
  >('nv.retrieveSavedSearches');
}
