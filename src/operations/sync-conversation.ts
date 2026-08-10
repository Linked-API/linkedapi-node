import { Operation, TOperationName } from '../core';
import { SimpleWorkflowMapper } from '../mappers';
import { TSyncConversationParams, TSyncConversationResult } from '../types';

export class SyncConversation extends Operation<TSyncConversationParams, TSyncConversationResult> {
  public override readonly operationName: TOperationName = 'syncConversation';
  protected override readonly mapper = new SimpleWorkflowMapper<
    TSyncConversationParams,
    TSyncConversationResult
  >({
    actionType: 'st.syncConversation',
  });
}
