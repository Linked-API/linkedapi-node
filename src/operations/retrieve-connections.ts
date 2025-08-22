import { PredefinedOperation, TOperationName } from '../core';
import { ArrayWorkflowMapper } from '../mappers/array-workflow-mapper';
import { TRetrieveConnectionsParams, TRetrieveConnectionsResult } from '../types';

export class RetrieveConnections extends PredefinedOperation<
  TRetrieveConnectionsParams,
  TRetrieveConnectionsResult[]
> {
  protected override readonly operationName: TOperationName = 'retrieveConnections';
  protected override readonly mapper = new ArrayWorkflowMapper<
    TRetrieveConnectionsParams,
    TRetrieveConnectionsResult
  >('st.retrieveConnections');
}
