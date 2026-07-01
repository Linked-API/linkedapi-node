export type TWebhookPayloadMode = 'thin' | 'fat';

export type TWebhookEventType =
  | 'workflow.created'
  | 'workflow.started'
  | 'workflow.completed'
  | 'account.active'
  | 'account.reconnectionRequired'
  | 'account.frozen'
  | 'account.deleted'
  | 'webhook.test';

export type TWebhookDeliveryStatus = 'pending' | 'delivering' | 'success' | 'failed';

export type TWorkflowWebhookStatus = 'pending' | 'running' | 'completed' | 'failed';

export type TAccountWebhookStatus = 'active' | 'reconnection_required' | 'frozen' | 'deleted';

export interface TWebhookSubscription {
  id: string;
  url: string;
  payloadMode: TWebhookPayloadMode;
  isActive: boolean;
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
}

export interface TSetWebhookPayloadModeParams {
  id: string;
  payloadMode: TWebhookPayloadMode;
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

export interface TWebhookTestEvent extends TWebhookEventBase {
  type: 'webhook.test';
  data: {
    message: string;
  };
}

export type TWebhookEvent = TWorkflowWebhookEvent | TAccountWebhookEvent | TWebhookTestEvent;
