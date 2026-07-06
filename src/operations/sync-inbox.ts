import { Operation, TOperationName } from '../core';
import { VoidWorkflowMapper } from '../mappers';
import { TSyncInboxParams } from '../types';

export class SyncInbox extends Operation<TSyncInboxParams, void> {
  public override readonly operationName: TOperationName = 'syncInbox';
  protected override readonly mapper = new VoidWorkflowMapper<TSyncInboxParams>('st.syncInbox');
}
