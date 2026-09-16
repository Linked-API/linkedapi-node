import { Operation, TOperationName } from '../core';
import { ArrayWorkflowMapper } from '../mappers/array-workflow-mapper';
import { TSearchPostResult, TSearchPostsParams } from '../types';

export class SearchPosts extends Operation<TSearchPostsParams, TSearchPostResult[]> {
  public override readonly operationName: TOperationName = 'searchPosts';
  protected override readonly mapper = new ArrayWorkflowMapper<
    TSearchPostsParams,
    TSearchPostResult
  >('st.searchPosts');
}
