import { TSupportedFunctionName } from '../core';
import { PredefinedOperation } from '../core/base-operation.abstract';
import { SimpleWorkflowMapper } from '../mappers';
import { TRetrievePerformanceResult } from '../types';

export class RetrievePerformance extends PredefinedOperation<void, TRetrievePerformanceResult> {
  protected override readonly functionName: TSupportedFunctionName = 'retrievePerformance';
  protected override readonly mapper = new SimpleWorkflowMapper<void, TRetrievePerformanceResult>({
    actionType: 'st.retrievePerformance',
  });
}
