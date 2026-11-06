import { Operation, TOperationName } from '../core';
import { SimpleWorkflowMapper } from '../mappers';
import { TNvCreatedSavedSearch, TNvCreateSavedSearchParams } from '../types';

/** Save a Sales Navigator search URL matching the requested type. Returns its id, name, type and URL. English interface only. */
export class NvCreateSavedSearch extends Operation<
  TNvCreateSavedSearchParams,
  TNvCreatedSavedSearch
> {
  public override readonly operationName: TOperationName = 'nvCreateSavedSearch';
  protected override readonly mapper = new SimpleWorkflowMapper<
    TNvCreateSavedSearchParams,
    TNvCreatedSavedSearch
  >({ actionType: 'nv.createSavedSearch' });
}
