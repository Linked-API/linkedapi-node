import { Operation, TOperationName } from '../core';
import { SimpleWorkflowMapper } from '../mappers';
import { TCommentOnPostParams, TCommentOnPostResult } from '../types';

export class CommentOnPost extends Operation<TCommentOnPostParams, TCommentOnPostResult> {
  public override readonly operationName: TOperationName = 'commentOnPost';
  protected override readonly mapper = new SimpleWorkflowMapper<
    TCommentOnPostParams,
    TCommentOnPostResult
  >({
    actionType: 'st.commentOnPost',
  });
}
