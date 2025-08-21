import { PredefinedOperation, TSupportedFunctionName } from '../core';
import { ArrayWorkflowMapper } from '../mappers/array-workflow-mapper';
import { TRetrievePendingRequestsResult } from '../types';

export class RetrievePendingRequests extends PredefinedOperation<
  void,
  TRetrievePendingRequestsResult[]
> {
  protected override readonly functionName: TSupportedFunctionName = 'retrievePendingRequests';
  protected override readonly mapper = new ArrayWorkflowMapper<
    void,
    TRetrievePendingRequestsResult
  >('st.retrievePendingRequests');
}
