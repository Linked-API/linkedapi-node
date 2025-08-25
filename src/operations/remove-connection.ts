import { Operation, TOperationName } from '../core';
import { VoidWorkflowMapper } from '../mappers';
import { TRemoveConnectionParams } from '../types';

export class RemoveConnection extends Operation<TRemoveConnectionParams, void> {
  protected override readonly operationName: TOperationName = 'removeConnection';
  protected override readonly mapper = new VoidWorkflowMapper<TRemoveConnectionParams>(
    'st.removeConnection',
  );
}
