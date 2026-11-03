import type { TConversationType, TMessageSender } from './actions/message';

export type TWebhookPayloadMode = 'thin' | 'fat';

export type TWebhookEventType =
  | 'workflow.created'
  | 'workflow.started'
  | 'workflow.completed'
  | 'account.active'
  | 'account.reconnectionRequired'
  | 'account.frozen'
  | 'account.deleted'
  | 'inbox.messageReceived'
  | 'inbox.messageSent'
  | 'network.connectionAccepted'
  | 'network.connectionAdded'
  | 'network.connectionRequestReceived'
  | 'webhook.test';

export type TWebhookEventSelector =
  | Exclude<TWebhookEventType, 'webhook.test'>
  | 'workflow.*'
  | 'account.*'
  | 'inbox.*'
  | 'network.*';

export type TWebhookDeliveryStatus = 'pending' | 'delivering' | 'success' | 'failed';

export type TWorkflowWebhookStatus = 'pending' | 'running' | 'completed' | 'failed';

export type TAccountWebhookStatus = 'active' | 'reconnection_required' | 'frozen' | 'deleted';

export interface TWebhookSubscription {
  id: string;
  url: string;
  payloadMode: TWebhookPayloadMode;
  isActive: boolean;
  signingEnabled: boolean;
  headerNames: Array<string>;
  events: Array<TWebhookEventSelector> | null;
  /** Returned only by set with signing enabled, setSigning(true), revealSecret or rotateSecret. */
  secret?: string;
  createdAt: string;
}

export interface TWebhookDelivery {
  id: string;
  eventType: TWebhookEventType;
  eventId: string;
  status: TWebhookDeliveryStatus;
  attempts: number;
  responseStatusCode: number | null;
  lastError: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface TSetWebhookParams {
  url: string;
  payloadMode?: TWebhookPayloadMode;
  signingEnabled?: boolean;
  headers?: Record<string, string>;
  events?: Array<TWebhookEventSelector> | null;
}

export interface TSetWebhookPayloadModeParams {
  id: string;
  payloadMode: TWebhookPayloadMode;
}

export interface TSetWebhookSigningParams {
  id: string;
  signingEnabled: boolean;
}

export interface TSetWebhookHeadersParams {
  id: string;
  headers: Record<string, string> | null;
}

export interface TSetWebhookHeaderParams {
  id: string;
  name: string;
  value: string;
}

export interface TDeleteWebhookHeaderParams {
  id: string;
  name: string;
}

export interface TRevealWebhookSecretParams {
  id: string;
}

export interface TRotateWebhookSecretParams {
  id: string;
}

export interface TSetWebhookEventsParams {
  id: string;
  events: Array<TWebhookEventSelector> | null;
}

export interface TDeleteWebhookParams {
  id: string;
}

export interface TReplayWebhookDeliveryParams {
  deliveryId: string;
}

interface TWebhookEventBase {
  id: string;
  createdAt: string;
}

export interface TWorkflowWebhookEvent extends TWebhookEventBase {
  type: 'workflow.created' | 'workflow.started' | 'workflow.completed';
  data: {
    workflowId: string;
    accountId: string;
    status: TWorkflowWebhookStatus;
    // Present only on workflow.completed delivered in `fat` payload mode; in `thin` mode fetch the
    // result via the workflow API by workflowId.
    result?: unknown;
  };
}

export interface TAccountWebhookEvent extends TWebhookEventBase {
  type: 'account.active' | 'account.reconnectionRequired' | 'account.frozen' | 'account.deleted';
  data: {
    accountId: string;
    status: TAccountWebhookStatus;
  };
}

export interface TInboxMessageWebhookEvent extends TWebhookEventBase {
  type: 'inbox.messageReceived' | 'inbox.messageSent';
  data: {
    accountId: string;
    type: TConversationType;
    threadId: string;
    personUrn: string | null;
    personHashedUrl: string;
    personPublicUrl: string | null;
    /** @deprecated Use `personHashedUrl`. Still returned by the API for compatibility. */
    personUrl: string;
    messageId: string;
    sender: TMessageSender;
    text: string;
    time: string;
  };
}

export interface TNetworkWebhookEvent extends TWebhookEventBase {
  type:
    | 'network.connectionAccepted'
    | 'network.connectionAdded'
    | 'network.connectionRequestReceived';
  data: {
    accountId: string;
    personUrn: string | null;
    personUrl: string;
    detectedAt: string;
  };
}

export interface TWebhookTestEvent extends TWebhookEventBase {
  type: 'webhook.test';
  data: {
    message: string;
  };
}

export type TWebhookEvent =
  | TWorkflowWebhookEvent
  | TAccountWebhookEvent
  | TInboxMessageWebhookEvent
  | TNetworkWebhookEvent
  | TWebhookTestEvent;
