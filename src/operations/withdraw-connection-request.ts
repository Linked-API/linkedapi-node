import { Operation, TOperationName } from '../core';
import { VoidWorkflowMapper } from '../mappers';
import { TWithdrawConnectionRequestParams } from '../types';

export class WithdrawConnectionRequest extends Operation<TWithdrawConnectionRequestParams, void> {
  protected override readonly operationName: TOperationName = 'withdrawConnectionRequest';
  protected override readonly mapper = new VoidWorkflowMapper<TWithdrawConnectionRequestParams>(
    'st.withdrawConnectionRequest',
  );
}
