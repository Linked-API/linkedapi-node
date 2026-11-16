import { Operation, TOperationName } from '../core';
import { VoidWorkflowMapper } from '../mappers';
import { TRcRenameProjectParams } from '../types';

export class RcRenameProject extends Operation<TRcRenameProjectParams, void> {
  public override readonly operationName: TOperationName = 'rcRenameProject';
  protected override readonly mapper = new VoidWorkflowMapper<TRcRenameProjectParams>(
    'rc.renameProject',
  );
}
