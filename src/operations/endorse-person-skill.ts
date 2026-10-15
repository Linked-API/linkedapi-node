import { Operation, TOperationName } from '../core';
import { VoidWorkflowMapper } from '../mappers';
import { TEndorsePersonSkillParams } from '../types';

export class EndorsePersonSkill extends Operation<TEndorsePersonSkillParams, void> {
  public override readonly operationName: TOperationName = 'endorsePersonSkill';
  protected override readonly mapper = new VoidWorkflowMapper<TEndorsePersonSkillParams>(
    'st.endorsePersonSkill',
  );
}
