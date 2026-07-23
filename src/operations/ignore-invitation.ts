import { Operation, TOperationName } from '../core';
import { VoidWorkflowMapper } from '../mappers';
import { TIgnoreInvitationParams } from '../types';

export class IgnoreInvitation extends Operation<TIgnoreInvitationParams, void> {
  public override readonly operationName: TOperationName = 'ignoreInvitation';
  protected override readonly mapper = new VoidWorkflowMapper<TIgnoreInvitationParams>(
    'st.ignoreInvitation',
  );
}
