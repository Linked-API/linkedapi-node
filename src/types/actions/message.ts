import { TBaseActionParams } from "../params";

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

export interface TConversationPollResponse {
  success: boolean;
  result?: TConversationPollResult[];
  error?: {
    type: string;
    message: string;
  };
}

export type TConversationType = "st" | "nv";
export type TMessageSender = "us" | "them";
