import { Operation, TOperationName } from '../core';
import { SimpleWorkflowMapper } from '../mappers';
import { TRetrieveSSIResult } from '../types';

export class RetrieveSSI extends Operation<void, TRetrieveSSIResult> {
  protected override readonly operationName: TOperationName = 'retrieveSSI';
  protected override readonly mapper = new SimpleWorkflowMapper<void, TRetrieveSSIResult>({
    actionType: 'st.retrieveSSI',
  });
}
