import { TSupportedFunctionName } from '../core';
import { PredefinedOperation } from '../core/base-operation.abstract';
import { VoidWorkflowMapper } from '../mappers/void-workflow-mapper';
import { TNvSendMessageParams } from '../types';

export class SalesNavigatorSendMessage extends PredefinedOperation<TNvSendMessageParams, void> {
  protected override readonly functionName: TSupportedFunctionName = 'salesNavigatorSendMessage';
  protected override readonly mapper = new VoidWorkflowMapper<TNvSendMessageParams>(
    'nv.sendMessage',
  );
}
