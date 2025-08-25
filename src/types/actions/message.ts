import { TBaseActionParams } from '../params';

export interface TSendMessageParams extends TBaseActionParams {
  personUrl: string;
  text: string;
}

export interface TSyncConversationParams extends TBaseActionParams {
  personUrl: string;
}

export interface TNvSendMessageParams extends TBaseActionParams {
  personUrl: string;
  text: string;
  subject: string;
}

export interface TNvSyncConversationParams extends TBaseActionParams {
  personUrl: string;
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
}

export interface TConversationPollResult {
  personUrl: string;
  since?: string;
  type: TConversationType;
  messages: TMessage[];
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
