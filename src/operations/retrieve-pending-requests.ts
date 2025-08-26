import { Operation, TOperationName } from '../core';
import { ArrayWorkflowMapper } from '../mappers/array-workflow-mapper';
import { TRetrievePendingRequestsResult } from '../types';

export class RetrievePendingRequests extends Operation<void, TRetrievePendingRequestsResult[]> {
  public override readonly operationName: TOperationName = 'retrievePendingRequests';
  protected override readonly mapper = new ArrayWorkflowMapper<
    void,
    TRetrievePendingRequestsResult
  >('st.retrievePendingRequests');
}
