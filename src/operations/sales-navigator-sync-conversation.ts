import { PredefinedOperation, TOperationName } from '../core';
import { VoidWorkflowMapper } from '../mappers';
import { TNvSyncConversationParams } from '../types';

export class SalesNavigatorSyncConversation extends PredefinedOperation<
  TNvSyncConversationParams,
  void
> {
  protected override readonly operationName: TOperationName = 'salesNavigatorSyncConversation';
  protected override readonly mapper = new VoidWorkflowMapper<TNvSyncConversationParams>(
    'nv.syncConversation',
  );
}
