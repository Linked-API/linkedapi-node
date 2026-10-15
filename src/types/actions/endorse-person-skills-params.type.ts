import type { TBaseActionParams } from '../params';

export interface TEndorsePersonSkillsParams extends TBaseActionParams {
  personUrl: string;
  skillNamePatterns?: Array<string>;
}
