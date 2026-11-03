import { INVITATION_TYPE } from './invitation-type.type';

interface TConnectInvitationTarget {
  invitationType: typeof INVITATION_TYPE.connect;
  personUrl: string;
  companyUrl?: never;
  newsletterUrl?: never;
}

interface TCompanyFollowInvitationTarget {
  invitationType: typeof INVITATION_TYPE.companyFollow;
  personUrl?: never;
  companyUrl: string;
  newsletterUrl?: never;
}

interface TNewsletterSubscribeInvitationTarget {
  invitationType: typeof INVITATION_TYPE.newsletterSubscribe;
  personUrl?: never;
  companyUrl?: never;
  newsletterUrl: string;
}

export type TInvitationTarget =
  | TConnectInvitationTarget
  | TCompanyFollowInvitationTarget
  | TNewsletterSubscribeInvitationTarget;
