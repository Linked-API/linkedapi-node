import type {
  TEndorsePersonSkillsParams,
  TPersonSkill,
  TPersonSkillEndorsement,
} from '../types/actions';
import { LinkedApiError } from '../types/errors';
import type {
  TWorkflowCompletion,
  TWorkflowDefinition,
  TWorkflowSingleData,
} from '../types/workflows';

import { BaseMapper, TMappedResponse } from './base-mapper.abstract';

type TSkillCompletion = TPersonSkill & TWorkflowSingleData;

export class EndorsePersonSkillsMapper extends BaseMapper<
  TEndorsePersonSkillsParams,
  Array<TPersonSkillEndorsement>
> {
  public override mapRequest(params: TEndorsePersonSkillsParams): TWorkflowDefinition {
    const { personUrl, skillNamePatterns } = params;

    return {
      actionType: 'st.openPersonPage',
      personUrl,
      basicInfo: false,
      then: {
        actionType: 'st.retrievePersonSkills',
        then: {
          actionType: 'st.doForSkills',
          ...(skillNamePatterns !== undefined ? { skillNamePatterns } : {}),
          then: {
            actionType: 'st.endorsePersonSkill',
          },
        },
      },
    };
  }

  public override mapResponse(
    completion: TWorkflowCompletion,
  ): TMappedResponse<Array<TPersonSkillEndorsement>> {
    const root = Array.isArray(completion) ? completion[0] : completion;
    if (!root) {
      throw LinkedApiError.unknownError();
    }
    if (root.error) {
      return { errors: [root.error] };
    }

    const then = Array.isArray(root.data) ? undefined : root.data?.then;
    const skillsAction = Array.isArray(then)
      ? then.find((action) => action.actionType === 'st.retrievePersonSkills')
      : then;
    if (!skillsAction || skillsAction.actionType !== 'st.retrievePersonSkills') {
      throw LinkedApiError.unknownError();
    }
    if (skillsAction.error) {
      return { errors: [skillsAction.error] };
    }
    if (!Array.isArray(skillsAction.data)) {
      throw LinkedApiError.unknownError();
    }

    const skills = skillsAction.data as Array<TSkillCompletion>;
    const data: Array<TPersonSkillEndorsement> = [];
    for (const skill of skills) {
      const endorsement = Array.isArray(skill.then)
        ? skill.then.find((action) => action.actionType === 'st.endorsePersonSkill')
        : skill.then;
      if (!endorsement || endorsement.actionType !== 'st.endorsePersonSkill') {
        continue;
      }

      data.push({
        skillName: skill.name,
        success: endorsement.success,
        ...(endorsement.error ? { error: endorsement.error } : {}),
      });
    }

    return {
      data,
      errors: [],
    };
  }
}
