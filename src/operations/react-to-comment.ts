import { Operation, TOperationName } from '../core';
import { VoidWorkflowMapper } from '../mappers';
import { TReactToCommentParams } from '../types';

export class ReactToComment extends Operation<TReactToCommentParams, void> {
  public override readonly operationName: TOperationName = 'reactToComment';
  protected override readonly mapper = new VoidWorkflowMapper<TReactToCommentParams>(
    'st.reactToComment',
  );
}
