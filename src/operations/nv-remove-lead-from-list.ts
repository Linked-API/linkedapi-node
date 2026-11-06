import { Operation, TOperationName } from '../core';
import { VoidWorkflowMapper } from '../mappers';
import { TNvRemoveLeadFromListParams } from '../types';

/** Remove a lead from exactly one owned custom list, keeping it saved and in its other lists. Repeating an absent membership succeeds. English interface only. */
export class NvRemoveLeadFromList extends Operation<TNvRemoveLeadFromListParams, void> {
  public override readonly operationName: TOperationName = 'nvRemoveLeadFromList';
  protected override readonly mapper = new VoidWorkflowMapper<TNvRemoveLeadFromListParams>(
    'nv.removeLeadFromList',
  );
}
