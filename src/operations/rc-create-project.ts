import { Operation, TOperationName } from '../core';
import { SimpleWorkflowMapper } from '../mappers';
import { TRcCreatedProject, TRcCreateProjectParams } from '../types';

export class RcCreateProject extends Operation<TRcCreateProjectParams, TRcCreatedProject> {
  public override readonly operationName: TOperationName = 'rcCreateProject';
  protected override readonly mapper = new SimpleWorkflowMapper<
    TRcCreateProjectParams,
    TRcCreatedProject
  >({ actionType: 'rc.createProject' });
}
