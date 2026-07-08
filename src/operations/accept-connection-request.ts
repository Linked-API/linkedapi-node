import { Operation, TOperationName } from '../core';
import { VoidWorkflowMapper } from '../mappers';
import { TAcceptConnectionRequestParams } from '../types';

export class AcceptConnectionRequest extends Operation<TAcceptConnectionRequestParams, void> {
  public override readonly operationName: TOperationName = 'acceptConnectionRequest';
  protected override readonly mapper = new VoidWorkflowMapper<TAcceptConnectionRequestParams>(
    'st.acceptConnectionRequest',
  );
}
