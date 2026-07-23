import { TBaseActionParams } from '../params';

import { TInvitationTarget } from './invitation-target.type';

export type TIgnoreInvitationParams = TBaseActionParams & TInvitationTarget;
