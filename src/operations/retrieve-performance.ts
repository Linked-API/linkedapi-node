import { Operation, TOperationName } from '../core';
import { SimpleWorkflowMapper } from '../mappers';
import { TRetrievePerformanceResult } from '../types';

export class RetrievePerformance extends Operation<void, TRetrievePerformanceResult> {
  protected override readonly operationName: TOperationName = 'retrievePerformance';
  protected override readonly mapper = new SimpleWorkflowMapper<void, TRetrievePerformanceResult>({
    actionType: 'st.retrievePerformance',
  });
}
