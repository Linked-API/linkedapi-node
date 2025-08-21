import { TSupportedFunctionName } from '../core';
import { PredefinedOperation } from '../core/base-operation.abstract';
import { VoidWorkflowMapper } from '../mappers';
import { TSendConnectionRequestParams } from '../types';

export class SendConnectionRequest extends PredefinedOperation<TSendConnectionRequestParams, void> {
  protected override readonly functionName: TSupportedFunctionName = 'sendConnectionRequest';
  protected override readonly mapper = new VoidWorkflowMapper<TSendConnectionRequestParams>(
    'st.sendConnectionRequest',
  );
}
