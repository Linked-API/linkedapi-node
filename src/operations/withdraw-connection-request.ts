import { TSupportedFunctionName } from '../core';
import { PredefinedOperation } from '../core/base-operation.abstract';
import { VoidWorkflowMapper } from '../mappers';
import { TWithdrawConnectionRequestParams } from '../types';

export class WithdrawConnectionRequest extends PredefinedOperation<
  TWithdrawConnectionRequestParams,
  void
> {
  protected override readonly functionName: TSupportedFunctionName = 'withdrawConnectionRequest';
  protected override readonly mapper = new VoidWorkflowMapper<TWithdrawConnectionRequestParams>(
    'st.withdrawConnectionRequest',
  );
}
