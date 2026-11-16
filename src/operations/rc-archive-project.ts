import { Operation, TOperationName } from '../core';
import { SimpleWorkflowMapper } from '../mappers';
import { TRcArchiveProjectParams, TRcArchiveProjectResult } from '../types';

export class RcArchiveProject extends Operation<TRcArchiveProjectParams, TRcArchiveProjectResult> {
  public override readonly operationName: TOperationName = 'rcArchiveProject';
  protected override readonly mapper = new SimpleWorkflowMapper<
    TRcArchiveProjectParams,
    TRcArchiveProjectResult
  >({ actionType: 'rc.archiveProject' });
}
