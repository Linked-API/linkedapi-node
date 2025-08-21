import { TSupportedFunctionName } from '../core';
import { PredefinedOperation } from '../core/base-operation.abstract';
import { SimpleWorkflowMapper } from '../mappers';
import { TRetrieveSSIResult } from '../types';

export class RetrieveSSI extends PredefinedOperation<void, TRetrieveSSIResult> {
  protected override readonly functionName: TSupportedFunctionName = 'retrieveSSI';
  protected override readonly mapper = new SimpleWorkflowMapper<void, TRetrieveSSIResult>({
    actionType: 'st.retrieveSSI',
  });
}
