import { TSupportedFunctionName } from '../core';
import { PredefinedOperation } from '../core/base-operation.abstract';
import { SimpleWorkflowMapper } from '../mappers';
import { TCheckConnectionStatusParams, TCheckConnectionStatusResult } from '../types';

export class CheckConnectionStatus extends PredefinedOperation<
  TCheckConnectionStatusParams,
  TCheckConnectionStatusResult
> {
  protected override readonly functionName: TSupportedFunctionName = 'checkConnectionStatus';
  protected override readonly mapper = new SimpleWorkflowMapper<
    TCheckConnectionStatusParams,
    TCheckConnectionStatusResult
  >({
    actionType: 'st.checkConnectionStatus',
  });
}
