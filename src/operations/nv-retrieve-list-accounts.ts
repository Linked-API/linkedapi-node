import { Operation, TOperationName } from '../core';
import { ArrayWorkflowMapper } from '../mappers';
import { TNvListAccount, TNvRetrieveListAccountsParams } from '../types';

/** Retrieve list accounts from an owned Sales Navigator list. */
export class NvRetrieveListAccounts extends Operation<
  TNvRetrieveListAccountsParams,
  Array<TNvListAccount>
> {
  public override readonly operationName: TOperationName = 'nvRetrieveListAccounts';
  protected override readonly mapper = new ArrayWorkflowMapper<
    TNvRetrieveListAccountsParams,
    TNvListAccount
  >('nv.retrieveListAccounts');
}
