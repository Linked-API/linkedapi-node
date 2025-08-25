import { Operation, TOperationName } from '../core';
import { VoidWorkflowMapper } from '../mappers';
import { TReactToPostParams } from '../types';

export class ReactToPost extends Operation<TReactToPostParams, void> {
  protected override readonly operationName: TOperationName = 'reactToPost';
  protected override readonly mapper = new VoidWorkflowMapper<TReactToPostParams>('st.reactToPost');
}
