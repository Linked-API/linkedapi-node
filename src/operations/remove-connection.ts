import { PredefinedOperation, TSupportedFunctionName } from '../core';
import { VoidWorkflowMapper } from '../mappers';
import { TRemoveConnectionParams } from '../types';

export class RemoveConnection extends PredefinedOperation<TRemoveConnectionParams, void> {
  protected override readonly functionName: TSupportedFunctionName = 'removeConnection';
  protected override readonly mapper = new VoidWorkflowMapper<TRemoveConnectionParams>(
    'st.removeConnection',
  );
}
