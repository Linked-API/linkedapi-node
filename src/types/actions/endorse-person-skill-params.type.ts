import type { TBaseActionParams } from '../params';

export interface TEndorsePersonSkillParams extends TBaseActionParams {
  personUrl: string;
  skillName: string;
}
