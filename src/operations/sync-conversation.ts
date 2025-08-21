import { TSupportedFunctionName } from '../core';
import { PredefinedOperation } from '../core/base-operation.abstract';
import { VoidWorkflowMapper } from '../mappers';
import { TSyncConversationParams } from '../types';

export class SyncConversation extends PredefinedOperation<TSyncConversationParams, void> {
  protected override readonly functionName: TSupportedFunctionName = 'syncConversation';
  protected override readonly mapper = new VoidWorkflowMapper<TSyncConversationParams>(
    'st.syncConversation',
  );
}
