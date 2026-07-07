import { Operation, TOperationName } from '../core';
import { VoidWorkflowMapper } from '../mappers';
import { TNvManageConversationParams } from '../types';

export class NvManageConversation extends Operation<TNvManageConversationParams, void> {
  public override readonly operationName: TOperationName = 'nvManageConversation';
  protected override readonly mapper = new VoidWorkflowMapper<TNvManageConversationParams>(
    'nv.manageConversation',
  );
}
