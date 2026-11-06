import { Operation, TOperationName } from '../core';
import { SimpleWorkflowMapper } from '../mappers';
import { TNvCreatedList, TNvCreateListParams } from '../types';

/**
 * Create an owned lead or account list. The name is trimmed and must contain 1–75 characters;
 * description is optional, has surrounding spaces trimmed, and allows at most 350 characters
 * after trimming. Blank descriptions are omitted. Same-type names
 * equal after trimming (case-sensitive), including system lists, fail with listAlreadyExists.
 * Returns the created list with its string ID, stored name, type and URL.
 */
export class NvCreateList extends Operation<TNvCreateListParams, TNvCreatedList> {
  public override readonly operationName: TOperationName = 'nvCreateList';
  protected override readonly mapper = new SimpleWorkflowMapper<
    TNvCreateListParams,
    TNvCreatedList
  >({ actionType: 'nv.createList' });
}
