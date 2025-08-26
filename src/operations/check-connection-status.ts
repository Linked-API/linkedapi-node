import { Operation, TOperationName } from '../core';
import { SimpleWorkflowMapper } from '../mappers';
import { TCheckConnectionStatusParams, TCheckConnectionStatusResult } from '../types';

export class CheckConnectionStatus extends Operation<
  TCheckConnectionStatusParams,
  TCheckConnectionStatusResult
> {
  public readonly operationName: TOperationName = 'checkConnectionStatus';
  protected override readonly mapper = new SimpleWorkflowMapper<
    TCheckConnectionStatusParams,
    TCheckConnectionStatusResult
  >({
    actionType: 'st.checkConnectionStatus',
  });
}
