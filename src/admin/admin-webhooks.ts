import {
  HttpClient,
  LinkedApiError,
  TDeleteWebhookParams,
  TLinkedApiErrorType,
  TReplayWebhookDeliveryParams,
  TSetWebhookParams,
  TSetWebhookPayloadModeParams,
  TWebhookDelivery,
  TWebhookSubscription,
} from '../types';

/**
 * Manage the client's registered outbound webhook and inspect recent deliveries.
 *
 * A client may hold at most one active webhook. It receives every event Linked API emits
 * (workflow lifecycle + account status changes); filter by the event `type` on your receiver.
 *
 * @see {@link https://linkedapi.io/docs/ Linked API Documentation}
 */
export class AdminWebhooks {
  constructor(private readonly httpClient: HttpClient) {}

  public async set(params: TSetWebhookParams): Promise<TWebhookSubscription> {
    const response = await this.httpClient.post<{ webhook: TWebhookSubscription }>(
      '/admin/webhook.set',
      params,
    );
    if (response.success && response.result) {
      return response.result.webhook;
    }
    throw new LinkedApiError(
      (response.error?.type ?? 'httpError') as TLinkedApiErrorType,
      response.error?.message ?? 'Failed to set webhook',
    );
  }

  public async get(): Promise<Array<TWebhookSubscription>> {
    const response = await this.httpClient.post<{ webhooks: Array<TWebhookSubscription> }>(
      '/admin/webhook.get',
    );
    if (response.success && response.result) {
      return response.result.webhooks;
    }
    throw new LinkedApiError(
      (response.error?.type ?? 'httpError') as TLinkedApiErrorType,
      response.error?.message ?? 'Failed to get webhooks',
    );
  }

  public async setPayloadMode(params: TSetWebhookPayloadModeParams): Promise<TWebhookSubscription> {
    const response = await this.httpClient.post<{ webhook: TWebhookSubscription }>(
      '/admin/webhook.setPayloadMode',
      params,
    );
    if (response.success && response.result) {
      return response.result.webhook;
    }
    throw new LinkedApiError(
      (response.error?.type ?? 'httpError') as TLinkedApiErrorType,
      response.error?.message ?? 'Failed to set webhook payload mode',
    );
  }

  public async delete(params: TDeleteWebhookParams): Promise<void> {
    const response = await this.httpClient.post('/admin/webhook.delete', params);
    if (response.success) {
      return;
    }
    throw new LinkedApiError(
      (response.error?.type ?? 'httpError') as TLinkedApiErrorType,
      response.error?.message ?? 'Failed to delete webhook',
    );
  }

  public async deliveries(): Promise<Array<TWebhookDelivery>> {
    const response = await this.httpClient.post<{ deliveries: Array<TWebhookDelivery> }>(
      '/admin/webhook.deliveries',
    );
    if (response.success && response.result) {
      return response.result.deliveries;
    }
    throw new LinkedApiError(
      (response.error?.type ?? 'httpError') as TLinkedApiErrorType,
      response.error?.message ?? 'Failed to get webhook deliveries',
    );
  }

  public async replayDelivery(params: TReplayWebhookDeliveryParams): Promise<void> {
    const response = await this.httpClient.post('/admin/webhook.replayDelivery', params);
    if (response.success) {
      return;
    }
    throw new LinkedApiError(
      (response.error?.type ?? 'httpError') as TLinkedApiErrorType,
      response.error?.message ?? 'Failed to replay webhook delivery',
    );
  }

  public async sendTest(): Promise<void> {
    const response = await this.httpClient.post('/admin/webhook.sendTest');
    if (response.success) {
      return;
    }
    throw new LinkedApiError(
      (response.error?.type ?? 'httpError') as TLinkedApiErrorType,
      response.error?.message ?? 'Failed to send test webhook',
    );
  }
}
