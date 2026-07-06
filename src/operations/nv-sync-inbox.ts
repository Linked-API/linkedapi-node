import { Operation, TOperationName } from '../core';
import { VoidWorkflowMapper } from '../mappers';
import { TNvSyncInboxParams } from '../types';

export class NvSyncInbox extends Operation<TNvSyncInboxParams, void> {
  public override readonly operationName: TOperationName = 'nvSyncInbox';
  protected override readonly mapper = new VoidWorkflowMapper<TNvSyncInboxParams>('nv.syncInbox');
}
