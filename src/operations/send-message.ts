import { Operation, TOperationName } from '../core';
import { VoidWorkflowMapper } from '../mappers/void-workflow-mapper';
import { TSendMessageParams } from '../types';

export class SendMessage extends Operation<TSendMessageParams, void> {
  protected override readonly operationName: TOperationName = 'sendMessage';
  protected override readonly mapper = new VoidWorkflowMapper<TSendMessageParams>('st.sendMessage');
}
