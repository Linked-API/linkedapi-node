import { Operation, TOperationName } from '../core';
import { VoidWorkflowMapper } from '../mappers';
import { TCommentOnPostParams } from '../types';

export class CommentOnPost extends Operation<TCommentOnPostParams, void> {
  protected override readonly operationName: TOperationName = 'commentOnPost';
  protected override readonly mapper = new VoidWorkflowMapper<TCommentOnPostParams>(
    'st.commentOnPost',
  );
}
