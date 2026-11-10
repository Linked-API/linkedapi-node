import { Operation, TOperationName } from '../core';
import { SimpleWorkflowMapper } from '../mappers';
import { TNvCreatedSavedSearch, TNvCreateSavedSearchParams } from '../types';

/** Save a Sales Navigator search URL matching the requested type. Optional name: trimmed, single line, 1–256 characters, unique per type (savedSearchAlreadyExists). Returns its id, name, type and URL. */
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
