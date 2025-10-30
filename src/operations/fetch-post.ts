import { Operation, TOperationName } from '../core';
import { TActionConfig, ThenWorkflowMapper } from '../mappers';
import { TBaseFetchPostParams, TFetchPostParams, TFetchPostResult } from '../types';

export class FetchPost extends Operation<TBaseFetchPostParams, TFetchPostResult> {
  public override readonly operationName: TOperationName = 'fetchPost';
  protected override readonly mapper = new FetchPostMapper();

  public override async execute<TParams extends TBaseFetchPostParams>(
    params: TFetchPostParams<TParams>,
  ): Promise<string> {
    return super.execute(params);
  }
}

const FETCH_POST_ACTIONS: TActionConfig[] = [
  {
    paramName: 'retrieveComments',
    actionType: 'st.retrievePostComments',
    configSource: 'commentsRetrievalConfig',
  },
  {
    paramName: 'retrieveReactions',
    actionType: 'st.retrievePostReactions',
    configSource: 'reactionsRetrievalConfig',
  },
];

const RESPONSE_MAPPINGS = [
  {
    actionType: 'st.retrievePostComments',
    targetProperty: 'comments',
  },
  {
    actionType: 'st.retrievePostReactions',
    targetProperty: 'reactions',
  },
];

export class FetchPostMapper<TParams extends TBaseFetchPostParams> extends ThenWorkflowMapper<
  TParams,
  TFetchPostResult
> {
  constructor() {
    super({
      actionConfigs: FETCH_POST_ACTIONS,
      responseMappings: RESPONSE_MAPPINGS,
      baseActionType: 'st.openPost',
      defaultParams: {
        basicInfo: true,
      },
    });
  }
}
