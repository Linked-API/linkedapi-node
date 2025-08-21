import { TSupportedFunctionName } from '../core';
import { PredefinedOperation } from '../core/base-operation.abstract';
import { VoidWorkflowMapper } from '../mappers';
import { TNvSyncConversationParams } from '../types';

export class SalesNavigatorSyncConversation extends PredefinedOperation<
  TNvSyncConversationParams,
  void
> {
  protected override readonly functionName: TSupportedFunctionName =
    'salesNavigatorSyncConversation';
  protected override readonly mapper = new VoidWorkflowMapper<TNvSyncConversationParams>(
    'nv.syncConversation',
  );
}
