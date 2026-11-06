import { Operation, TOperationName } from '../core';
import { SimpleWorkflowMapper } from '../mappers';
import { TNvCreatedList, TNvRenameListParams } from '../types';

/** Rename an owned custom list. Trimmed name: 1–75 characters, no line breaks. Same name succeeds; duplicates return listAlreadyExists and system lists return listNotRenamable. English interface only. */
export class NvRenameList extends Operation<TNvRenameListParams, TNvCreatedList> {
  public override readonly operationName: TOperationName = 'nvRenameList';
  protected override readonly mapper = new SimpleWorkflowMapper<
    TNvRenameListParams,
    TNvCreatedList
  >({ actionType: 'nv.renameList' });
}
