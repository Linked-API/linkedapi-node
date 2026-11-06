import { Operation, TOperationName } from '../core';
import { VoidWorkflowMapper } from '../mappers';
import { TNvSaveLeadParams } from '../types';

/**
 * Ensure a lead is saved; with listId, also ensure membership in that one list, leaving other
 * lists untouched. Without listId, leave lists unchanged. Repeating succeeds without changes.
 * Saving a lead may also save its current company in Sales Navigator. Current limitation: If
 * you have more than 10 lead lists, Sales Navigator shows ten lists at a time. If the requested
 * list is not shown, the call fails with unexpectedError. The lead may already be saved, but
 * not added to that list.
 */
export class NvSaveLead extends Operation<TNvSaveLeadParams, void> {
  public override readonly operationName: TOperationName = 'nvSaveLead';
  protected override readonly mapper = new VoidWorkflowMapper<TNvSaveLeadParams>('nv.saveLead');
}
