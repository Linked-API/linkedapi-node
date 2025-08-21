import { PredefinedOperation, TSupportedFunctionName } from '../core';
import { VoidWorkflowMapper } from '../mappers';
import { TReactToPostParams } from '../types';

export class ReactToPost extends PredefinedOperation<TReactToPostParams, void> {
  protected override readonly functionName: TSupportedFunctionName = 'reactToPost';
  protected override readonly mapper = new VoidWorkflowMapper<TReactToPostParams>('st.reactToPost');
}
