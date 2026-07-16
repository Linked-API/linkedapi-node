import { Operation, TOperationName } from '../core';
import { VoidWorkflowMapper } from '../mappers';
import { TSyncNetworkParams } from '../types';

export class SyncNetwork extends Operation<TSyncNetworkParams, void> {
  public override readonly operationName: TOperationName = 'syncNetwork';
  protected override readonly mapper = new VoidWorkflowMapper<TSyncNetworkParams>('st.syncNetwork');
}
