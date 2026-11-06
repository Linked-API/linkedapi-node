import { Operation, TOperationName } from '../core';
import { VoidWorkflowMapper } from '../mappers';
import { TNvUnsaveAccountParams } from '../types';

/** Unsave the account only; its saved leads stay saved. Repeating succeeds without changes. */
export class NvUnsaveAccount extends Operation<TNvUnsaveAccountParams, void> {
  public override readonly operationName: TOperationName = 'nvUnsaveAccount';
  protected override readonly mapper = new VoidWorkflowMapper<TNvUnsaveAccountParams>(
    'nv.unsaveAccount',
  );
}
