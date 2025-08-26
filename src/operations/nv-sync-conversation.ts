import { Operation, TOperationName } from '../core';
import { VoidWorkflowMapper } from '../mappers';
import { TNvSyncConversationParams } from '../types';

export class NvSyncConversation extends Operation<TNvSyncConversationParams, void> {
  public override readonly operationName: TOperationName = 'nvSyncConversation';
  protected override readonly mapper = new VoidWorkflowMapper<TNvSyncConversationParams>(
    'nv.syncConversation',
  );
}
