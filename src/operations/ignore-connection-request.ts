import { Operation, TOperationName } from '../core';
import { VoidWorkflowMapper } from '../mappers';
import { TIgnoreConnectionRequestParams } from '../types';

export class IgnoreConnectionRequest extends Operation<TIgnoreConnectionRequestParams, void> {
  public override readonly operationName: TOperationName = 'ignoreConnectionRequest';
  protected override readonly mapper = new VoidWorkflowMapper<TIgnoreConnectionRequestParams>(
    'st.ignoreConnectionRequest',
  );
}
