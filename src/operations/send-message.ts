import { TSupportedFunctionName } from '../core';
import { PredefinedOperation } from '../core/base-operation.abstract';
import { VoidWorkflowMapper } from '../mappers/void-workflow-mapper';
import { TSendMessageParams } from '../types';

export class SendMessage extends PredefinedOperation<TSendMessageParams, void> {
  protected override readonly functionName: TSupportedFunctionName = 'sendMessage';
  protected override readonly mapper = new VoidWorkflowMapper<TSendMessageParams>('st.sendMessage');
}
