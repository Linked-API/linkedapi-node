import { Operation, TOperationName } from '../core';
import { ArrayWorkflowMapper } from '../mappers/array-workflow-mapper';
import { TRetrieveConnectionRequestsResult } from '../types';

export class RetrieveConnectionRequests extends Operation<
  void,
  TRetrieveConnectionRequestsResult[]
> {
  public override readonly operationName: TOperationName = 'retrieveConnectionRequests';
  protected override readonly mapper = new ArrayWorkflowMapper<
    void,
    TRetrieveConnectionRequestsResult
  >('st.retrieveConnectionRequests');
}
