import { TSupportedFunctionName } from '../core';
import { PredefinedOperation } from '../core/base-operation.abstract';
import { ArrayWorkflowMapper } from '../mappers/array-workflow-mapper';
import { TRetrieveConnectionsParams, TRetrieveConnectionsResult } from '../types';

export class RetrieveConnections extends PredefinedOperation<
  TRetrieveConnectionsParams,
  TRetrieveConnectionsResult[]
> {
  protected override readonly functionName: TSupportedFunctionName = 'retrieveConnections';
  protected override readonly mapper = new ArrayWorkflowMapper<
    TRetrieveConnectionsParams,
    TRetrieveConnectionsResult
  >('st.retrieveConnections');
}
