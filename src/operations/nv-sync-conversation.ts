import { Operation, TOperationName } from '../core';
import { SimpleWorkflowMapper } from '../mappers';
import { TNvSyncConversationParams, TNvSyncConversationResult } from '../types';

export class NvSyncConversation extends Operation<
  TNvSyncConversationParams,
  TNvSyncConversationResult
> {
  public override readonly operationName: TOperationName = 'nvSyncConversation';
  protected override readonly mapper = new SimpleWorkflowMapper<
    TNvSyncConversationParams,
    TNvSyncConversationResult
  >({
    actionType: 'nv.syncConversation',
  });
}
