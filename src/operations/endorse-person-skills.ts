import { Operation, TOperationName } from '../core';
import { EndorsePersonSkillsMapper } from '../mappers/endorse-person-skills-mapper';
import { TEndorsePersonSkillsParams, TPersonSkillEndorsement } from '../types';

export class EndorsePersonSkills extends Operation<
  TEndorsePersonSkillsParams,
  Array<TPersonSkillEndorsement>
> {
  public override readonly operationName: TOperationName = 'endorsePersonSkills';
  protected override readonly mapper = new EndorsePersonSkillsMapper();
}
