import { PredefinedOperation, TOperationName } from '../core';
import { VoidWorkflowMapper } from '../mappers';
import { TSendConnectionRequestParams } from '../types';

export class SendConnectionRequest extends PredefinedOperation<TSendConnectionRequestParams, void> {
  protected override readonly functionName: TOperationName = 'sendConnectionRequest';
  protected override readonly mapper = new VoidWorkflowMapper<TSendConnectionRequestParams>(
    'st.sendConnectionRequest',
  );
}
