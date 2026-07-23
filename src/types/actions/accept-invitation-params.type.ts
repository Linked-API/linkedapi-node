import { TBaseActionParams } from '../params';

import { TInvitationTarget } from './invitation-target.type';

export type TAcceptInvitationParams = TBaseActionParams & TInvitationTarget;
