import { Operation, TOperationName } from '../core';
import { VoidWorkflowMapper } from '../mappers';
import { TNvDeleteListParams } from '../types';

/**
 * Delete one owned list by its string ID. By default its members stay saved and in their other lists;
 * unsave 'members' also unsaves them, which removes them from your other lists too.
 * Unknown, shared or already-deleted lists return listNotFound; system lists without a Delete
 * action return listNotDeletable. Success has no result data.
 */
export class NvDeleteList extends Operation<TNvDeleteListParams, void> {
  public override readonly operationName: TOperationName = 'nvDeleteList';
  protected override readonly mapper = new VoidWorkflowMapper<TNvDeleteListParams>('nv.deleteList');
}
