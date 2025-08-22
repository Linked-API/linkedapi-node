import { PredefinedOperation, TOperationName } from '../core';
import { SimpleWorkflowMapper } from '../mappers';
import { TRetrieveSSIResult } from '../types';

export class RetrieveSSI extends PredefinedOperation<void, TRetrieveSSIResult> {
  protected override readonly functionName: TOperationName = 'retrieveSSI';
  protected override readonly mapper = new SimpleWorkflowMapper<void, TRetrieveSSIResult>({
    actionType: 'st.retrieveSSI',
  });
}
