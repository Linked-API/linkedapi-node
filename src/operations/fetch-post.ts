import { TSupportedFunctionName } from '../core';
import { PredefinedOperation } from '../core/base-operation.abstract';
import { SimpleWorkflowMapper } from '../mappers';
import { TFetchPostParams, TFetchPostResult } from '../types';

export class FetchPost extends PredefinedOperation<TFetchPostParams, TFetchPostResult> {
  protected override readonly functionName: TSupportedFunctionName = 'fetchPost';
  protected override readonly mapper = new SimpleWorkflowMapper<TFetchPostParams, TFetchPostResult>(
    {
      actionType: 'st.openPost',
      defaultParams: {
        basicInfo: true,
      },
    },
  );
}
