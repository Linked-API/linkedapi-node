import { Operation, TOperationName } from '../core';
import { ArrayWorkflowMapper } from '../mappers';
import { TNvList, TNvRetrieveListsParams } from '../types';

/** Retrieve every owned Sales Navigator list of the requested type. Results contain id (string), name, type (lead/account), source (open upstream string), entityCount (number or null), and url. */
export class NvRetrieveLists extends Operation<TNvRetrieveListsParams, Array<TNvList>> {
  public override readonly operationName: TOperationName = 'nvRetrieveLists';
  protected override readonly mapper = new ArrayWorkflowMapper<TNvRetrieveListsParams, TNvList>(
    'nv.retrieveLists',
  );
}
