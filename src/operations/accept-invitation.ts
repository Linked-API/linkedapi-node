import { Operation, TOperationName } from '../core';
import { VoidWorkflowMapper } from '../mappers';
import { TAcceptInvitationParams } from '../types';

export class AcceptInvitation extends Operation<TAcceptInvitationParams, void> {
  public override readonly operationName: TOperationName = 'acceptInvitation';
  protected override readonly mapper = new VoidWorkflowMapper<TAcceptInvitationParams>(
    'st.acceptInvitation',
  );
}
