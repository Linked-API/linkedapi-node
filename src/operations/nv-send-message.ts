import { Operation, TOperationName } from '../core';
import { VoidWorkflowMapper } from '../mappers/void-workflow-mapper';
import { TNvSendMessageParams } from '../types';

export class NvSendMessage extends Operation<TNvSendMessageParams, void> {
  protected override readonly operationName: TOperationName = 'nvSendMessage';
  protected override readonly mapper = new VoidWorkflowMapper<TNvSendMessageParams>(
    'nv.sendMessage',
  );
}
