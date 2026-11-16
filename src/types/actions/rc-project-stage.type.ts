export const RC_PROJECT_STAGE = {
  uncontacted: 'uncontacted',
  contacted: 'contacted',
  replied: 'replied',
  archived: 'archived',
} as const;

export type TRcProjectStage = (typeof RC_PROJECT_STAGE)[keyof typeof RC_PROJECT_STAGE];
