import { Operation, TOperationName } from '../core';
import { SimpleWorkflowMapper } from '../mappers';
import { TRcSaveToProjectParams, TRcSaveToProjectResult } from '../types';

export class RcSaveToProject extends Operation<TRcSaveToProjectParams, TRcSaveToProjectResult> {
  public override readonly operationName: TOperationName = 'rcSaveToProject';
  protected override readonly mapper = new SimpleWorkflowMapper<
    TRcSaveToProjectParams,
    TRcSaveToProjectResult
  >({ actionType: 'rc.saveToProject' });
}
