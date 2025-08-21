import { PredefinedOperation, TSupportedFunctionName } from '../core';
import { VoidWorkflowMapper } from '../mappers';
import { TCommentOnPostParams } from '../types';

export class CommentOnPost extends PredefinedOperation<TCommentOnPostParams, void> {
  protected override readonly functionName: TSupportedFunctionName = 'commentOnPost';
  protected override readonly mapper = new VoidWorkflowMapper<TCommentOnPostParams>(
    'st.commentOnPost',
  );
}
