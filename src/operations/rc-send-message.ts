import { Operation, TOperationName } from '../core';
import { SimpleWorkflowMapper } from '../mappers';
import { TRcSendMessageParams, TRcSendMessageResult } from '../types';

export class RcSendMessage extends Operation<TRcSendMessageParams, TRcSendMessageResult> {
  public override readonly operationName: TOperationName = 'rcSendMessage';
  protected override readonly mapper = new SimpleWorkflowMapper<
    TRcSendMessageParams,
    TRcSendMessageResult
  >({ actionType: 'rc.sendMessage' });
}
