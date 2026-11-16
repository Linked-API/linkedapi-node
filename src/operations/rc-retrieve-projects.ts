import { Operation, TOperationName } from '../core';
import { ArrayWorkflowMapper } from '../mappers';
import { TRcProject, TRcRetrieveProjectsParams } from '../types';

export class RcRetrieveProjects extends Operation<TRcRetrieveProjectsParams, Array<TRcProject>> {
  public override readonly operationName: TOperationName = 'rcRetrieveProjects';
  protected override readonly mapper = new ArrayWorkflowMapper<
    TRcRetrieveProjectsParams,
    TRcProject
  >('rc.retrieveProjects');
}
