import { Operation, TOperationName } from '../core';
import { ArrayWorkflowMapper } from '../mappers/array-workflow-mapper';
import { TRetrieveInvitationsResult } from '../types';

export class RetrieveInvitations extends Operation<void, Array<TRetrieveInvitationsResult>> {
  public override readonly operationName: TOperationName = 'retrieveInvitations';
  protected override readonly mapper = new ArrayWorkflowMapper<void, TRetrieveInvitationsResult>(
    'st.retrieveInvitations',
  );
}
