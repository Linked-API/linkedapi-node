import { Operation, TOperationName } from '../core';
import { VoidWorkflowMapper } from '../mappers';
import { TNvRemoveAccountFromListParams } from '../types';

/** Remove an account from exactly one owned custom list, keeping it saved even after its last list. Repeating an absent membership succeeds. English interface only. */
export class NvRemoveAccountFromList extends Operation<TNvRemoveAccountFromListParams, void> {
  public override readonly operationName: TOperationName = 'nvRemoveAccountFromList';
  protected override readonly mapper = new VoidWorkflowMapper<TNvRemoveAccountFromListParams>(
    'nv.removeAccountFromList',
  );
}
