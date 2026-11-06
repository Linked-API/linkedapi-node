import { Operation, TOperationName } from '../core';
import { VoidWorkflowMapper } from '../mappers';
import { TNvUnsaveLeadParams } from '../types';

/** Use Sales Navigator's native unsave: the lead is no longer saved and leaves every custom list the user owns. Repeating succeeds without changes. */
export class NvUnsaveLead extends Operation<TNvUnsaveLeadParams, void> {
  public override readonly operationName: TOperationName = 'nvUnsaveLead';
  protected override readonly mapper = new VoidWorkflowMapper<TNvUnsaveLeadParams>('nv.unsaveLead');
}
