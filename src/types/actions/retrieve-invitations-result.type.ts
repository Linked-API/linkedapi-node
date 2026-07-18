import { INVITATION_TYPE } from './invitation-type.type';

interface TInvitationBase {
  name: string;
  publicUrl: string;
}

interface TConnectInvitation extends TInvitationBase {
  invitationType: typeof INVITATION_TYPE.connect;
  headline: string | null;
  note: string | null;
}

interface TCompanyFollowInvitation extends TInvitationBase {
  invitationType: typeof INVITATION_TYPE.companyFollow;
  companyUrl: string;
  companyName: string | null;
}

interface TNewsletterSubscribeInvitation extends TInvitationBase {
  invitationType: typeof INVITATION_TYPE.newsletterSubscribe;
  newsletterUrl: string;
  newsletterName: string | null;
}

export type TRetrieveInvitationsResult =
  | TConnectInvitation
  | TCompanyFollowInvitation
  | TNewsletterSubscribeInvitation;
