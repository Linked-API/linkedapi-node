export const INVITATION_TYPE = {
  connect: 'connect',
  companyFollow: 'companyFollow',
  newsletterSubscribe: 'newsletterSubscribe',
} as const;

export type TInvitationType = (typeof INVITATION_TYPE)[keyof typeof INVITATION_TYPE];
