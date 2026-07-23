import { Operation, TOperationName } from '../core';
import { ArrayWorkflowMapper } from '../mappers/array-workflow-mapper';
import { TFeedPost, TRetrieveFeedParams } from '../types';

export class RetrieveFeed extends Operation<TRetrieveFeedParams, Array<TFeedPost>> {
  public override readonly operationName: TOperationName = 'retrieveFeed';
  protected override readonly mapper = new ArrayWorkflowMapper<TRetrieveFeedParams, TFeedPost>(
    'st.retrieveFeed',
  );
}
