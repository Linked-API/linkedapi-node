import { Operation, TOperationName } from '../core';
import { SimpleWorkflowMapper } from '../mappers';
import { TFetchPostParams, TFetchPostResult } from '../types';

export class FetchPost extends Operation<TFetchPostParams, TFetchPostResult> {
  public override readonly operationName: TOperationName = 'fetchPost';
  protected override readonly mapper = new SimpleWorkflowMapper<TFetchPostParams, TFetchPostResult>(
    {
      actionType: 'st.openPost',
      defaultParams: {
        basicInfo: true,
      },
    },
  );
}
