import { Operation, TOperationName } from '../core';
import { VoidWorkflowMapper } from '../mappers';
import { TRcSyncInboxParams } from '../types';

export class RcSyncInbox extends Operation<TRcSyncInboxParams, void> {
  public override readonly operationName: TOperationName = 'rcSyncInbox';
  protected override readonly mapper = new VoidWorkflowMapper<TRcSyncInboxParams>('rc.syncInbox');
}
