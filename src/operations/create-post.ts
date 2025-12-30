import { Operation, TOperationName } from '../core';
import { SimpleWorkflowMapper } from '../mappers';
import { TCreatePostParams, TCreatePostResult } from '../types';

export class CreatePost extends Operation<TCreatePostParams, TCreatePostResult> {
  public override readonly operationName: TOperationName = 'createPost';
  protected override readonly mapper = new SimpleWorkflowMapper<
    TCreatePostParams,
    TCreatePostResult
  >({
    actionType: 'st.createPost',
  });
}
