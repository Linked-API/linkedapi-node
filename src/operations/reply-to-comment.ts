import { Operation, TOperationName } from '../core';
import { SimpleWorkflowMapper } from '../mappers';
import { TReplyToCommentParams, TReplyToCommentResult } from '../types';

export class ReplyToComment extends Operation<TReplyToCommentParams, TReplyToCommentResult> {
  public override readonly operationName: TOperationName = 'replyToComment';
  protected override readonly mapper = new SimpleWorkflowMapper<
    TReplyToCommentParams,
    TReplyToCommentResult
  >({
    actionType: 'st.replyToComment',
  });
}
