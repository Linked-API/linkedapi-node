import { Operation, TOperationName } from '../core';
import { VoidWorkflowMapper } from '../mappers';
import { TManageConversationParams } from '../types';

export class ManageConversation extends Operation<TManageConversationParams, void> {
  public override readonly operationName: TOperationName = 'manageConversation';
  protected override readonly mapper = new VoidWorkflowMapper<TManageConversationParams>(
    'st.manageConversation',
  );
}
