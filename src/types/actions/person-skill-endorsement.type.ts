import type { TLinkedApiActionError } from '../errors';

export interface TPersonSkillEndorsement {
  skillName: string;
  success: boolean;
  error?: TLinkedApiActionError;
}
