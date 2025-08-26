import { Operation, TOperationName } from '../core';
import { VoidWorkflowMapper } from '../mappers';
import { TSendConnectionRequestParams } from '../types';

export class SendConnectionRequest extends Operation<TSendConnectionRequestParams, void> {
  public override readonly operationName: TOperationName = 'sendConnectionRequest';
  protected override readonly mapper = new VoidWorkflowMapper<TSendConnectionRequestParams>(
    'st.sendConnectionRequest',
  );
}
