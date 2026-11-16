import { Operation, TOperationName } from '../core';
import { ArrayWorkflowMapper } from '../mappers';
import { TRcProjectCandidate, TRcRetrieveProjectCandidatesParams } from '../types';

export class RcRetrieveProjectCandidates extends Operation<
  TRcRetrieveProjectCandidatesParams,
  Array<TRcProjectCandidate>
> {
  public override readonly operationName: TOperationName = 'rcRetrieveProjectCandidates';
  protected override readonly mapper = new ArrayWorkflowMapper<
    TRcRetrieveProjectCandidatesParams,
    TRcProjectCandidate
  >('rc.retrieveProjectCandidates');
}
