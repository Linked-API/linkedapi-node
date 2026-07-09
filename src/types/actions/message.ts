import { TBaseActionParams } from '../params';

export interface TSendMessageParams extends TBaseActionParams {
  personUrl?: string;
  text: string;
  threadId?: string;
  manageConversation?: TSendMessageManageConversation;
}

export interface TSendMessageManageConversation {
  operation: TManageConversationOperation;
}

export interface TSyncConversationParams extends TBaseActionParams {
  personUrl: string;
}

export interface TSyncInboxParams extends TBaseActionParams {}

export interface TNvSendMessageParams extends TBaseActionParams {
  personUrl?: string;
  text: string;
  subject?: string;
  threadId?: string;
}

export interface TNvSyncConversationParams extends TBaseActionParams {
  personUrl: string;
}

export interface TNvSyncInboxParams extends TBaseActionParams {}

export interface TManageConversationParams extends TBaseActionParams {
  threadId: string;
  operation: TManageConversationOperation;
}

export interface TNvManageConversationParams extends TBaseActionParams {
  threadId: string;
  operation: TNvManageConversationOperation;
}

export interface TConversationPollRequest {
  personUrl: string;
  since?: string;
  type: TConversationType;
}

export interface TMessage {
  id: string;
  sender: TMessageSender;
  text: string;
  time: string;
  threadId: string | null;
}

export interface TConversationPollResult {
  personUrl: string;
  since?: string;
  type: TConversationType;
  messages: TMessage[];
}

export interface TInboxPollRequest {
  since?: string;
  type?: TConversationType;
  threadId?: string;
}

export interface TInboxMessage {
  id: string;
  type: TConversationType;
  threadId: string;
  personUrl: string;
  sender: TMessageSender;
  text: string;
  time: string;
}

export interface TInboxPollResult {
  messages: TInboxMessage[];
}

export const CONVERSATION_TYPE = {
  st: 'st',
  nv: 'nv',
} as const;
export type TConversationType = (typeof CONVERSATION_TYPE)[keyof typeof CONVERSATION_TYPE];

export const MESSAGE_SENDER = {
  us: 'us',
  them: 'them',
} as const;
export type TMessageSender = (typeof MESSAGE_SENDER)[keyof typeof MESSAGE_SENDER];

export const MANAGE_CONVERSATION_OPERATION = {
  archive: 'archive',
  unarchive: 'unarchive',
  star: 'star',
  unstar: 'unstar',
  mute: 'mute',
  unmute: 'unmute',
} as const;
export type TManageConversationOperation =
  (typeof MANAGE_CONVERSATION_OPERATION)[keyof typeof MANAGE_CONVERSATION_OPERATION];

export const NV_MANAGE_CONVERSATION_OPERATION = {
  archive: 'archive',
  unarchive: 'unarchive',
} as const;
export type TNvManageConversationOperation =
  (typeof NV_MANAGE_CONVERSATION_OPERATION)[keyof typeof NV_MANAGE_CONVERSATION_OPERATION];
