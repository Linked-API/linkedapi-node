import { PredefinedOperation, TOperationName } from '../core';
import { VoidWorkflowMapper } from '../mappers/void-workflow-mapper';
import { TNvSendMessageParams } from '../types';

export class SalesNavigatorSendMessage extends PredefinedOperation<TNvSendMessageParams, void> {
  protected override readonly functionName: TOperationName = 'salesNavigatorSendMessage';
  protected override readonly mapper = new VoidWorkflowMapper<TNvSendMessageParams>(
    'nv.sendMessage',
  );
}
