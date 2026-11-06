import { Operation, TOperationName } from '../core';
import { VoidWorkflowMapper } from '../mappers';
import { TNvSaveAccountParams } from '../types';

/**
 * Ensure an account is saved; with listId, also ensure membership in that one list, leaving
 * other lists untouched. Without listId, leave lists unchanged. Repeating succeeds without
 * changes. Current limitation: If you have more than 10 account lists, Sales Navigator shows
 * ten lists at a time. If the requested list is not shown, the call fails with unexpectedError.
 * The account may already be saved, but not added to that list.
 */
export class NvSaveAccount extends Operation<TNvSaveAccountParams, void> {
  public override readonly operationName: TOperationName = 'nvSaveAccount';
  protected override readonly mapper = new VoidWorkflowMapper<TNvSaveAccountParams>(
    'nv.saveAccount',
  );
}
