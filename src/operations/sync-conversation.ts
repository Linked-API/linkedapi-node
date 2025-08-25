import { Operation, TOperationName } from '../core';
import { VoidWorkflowMapper } from '../mappers';
import { TSyncConversationParams } from '../types';

export class SyncConversation extends Operation<TSyncConversationParams, void> {
  protected override readonly operationName: TOperationName = 'syncConversation';
  protected override readonly mapper = new VoidWorkflowMapper<TSyncConversationParams>(
    'st.syncConversation',
  );
}
