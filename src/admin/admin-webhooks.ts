import {
  HttpClient,
  LinkedApiError,
  TDeleteWebhookHeaderParams,
  TDeleteWebhookParams,
  TLinkedApiErrorType,
  TReplayWebhookDeliveryParams,
  TRevealWebhookSecretParams,
  TRotateWebhookSecretParams,
  TSetWebhookEventsParams,
  TSetWebhookHeaderParams,
  TSetWebhookHeadersParams,
  TSetWebhookParams,
  TSetWebhookPayloadModeParams,
  TSetWebhookSigningParams,
  TWebhookDelivery,
  TWebhookSubscription,
} from '../types';

/**
 * Manage the client's registered outbound webhook and inspect recent deliveries.
 *
 * A client may hold at most one active webhook. Its event selectors control which workflow,
 * account, inbox and network events it receives; null selects all events. Test events are always
 * delivered. Signing and custom headers are configured per subscription.
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

  /** Enable or disable signing. Enabling returns the stored secret. */
  public async setSigning(params: TSetWebhookSigningParams): Promise<TWebhookSubscription> {
    const response = await this.httpClient.post<{ webhook: TWebhookSubscription }>(
      '/admin/webhook.setSigning',
      params,
    );
    if (response.success && response.result) {
      return response.result.webhook;
    }
    throw new LinkedApiError(
      (response.error?.type ?? 'httpError') as TLinkedApiErrorType,
      response.error?.message ?? 'Failed to set webhook signing',
    );
  }

  /** Replace all custom headers. Pass null or an empty object to clear them. */
  public async setHeaders(params: TSetWebhookHeadersParams): Promise<TWebhookSubscription> {
    const response = await this.httpClient.post<{ webhook: TWebhookSubscription }>(
      '/admin/webhook.setHeaders',
      params,
    );
    if (response.success && response.result) {
      return response.result.webhook;
    }
    throw new LinkedApiError(
      (response.error?.type ?? 'httpError') as TLinkedApiErrorType,
      response.error?.message ?? 'Failed to set webhook headers',
    );
  }

  /** Set one custom header; its name is matched case-insensitively. */
  public async setHeader(params: TSetWebhookHeaderParams): Promise<TWebhookSubscription> {
    const response = await this.httpClient.post<{ webhook: TWebhookSubscription }>(
      '/admin/webhook.setHeader',
      params,
    );
    if (response.success && response.result) {
      return response.result.webhook;
    }
    throw new LinkedApiError(
      (response.error?.type ?? 'httpError') as TLinkedApiErrorType,
      response.error?.message ?? 'Failed to set webhook header',
    );
  }

  /** Remove one custom header; its name is matched case-insensitively. */
  public async deleteHeader(params: TDeleteWebhookHeaderParams): Promise<TWebhookSubscription> {
    const response = await this.httpClient.post<{ webhook: TWebhookSubscription }>(
      '/admin/webhook.deleteHeader',
      params,
    );
    if (response.success && response.result) {
      return response.result.webhook;
    }
    throw new LinkedApiError(
      (response.error?.type ?? 'httpError') as TLinkedApiErrorType,
      response.error?.message ?? 'Failed to delete webhook header',
    );
  }

  /** Return the current signing secret without changing it. */
  public async revealSecret(params: TRevealWebhookSecretParams): Promise<TWebhookSubscription> {
    const response = await this.httpClient.post<{ webhook: TWebhookSubscription }>(
      '/admin/webhook.revealSecret',
      params,
    );
    if (response.success && response.result) {
      return response.result.webhook;
    }
    throw new LinkedApiError(
      (response.error?.type ?? 'httpError') as TLinkedApiErrorType,
      response.error?.message ?? 'Failed to reveal webhook secret',
    );
  }

  /** Replace the signing secret and return its new value. */
  public async rotateSecret(params: TRotateWebhookSecretParams): Promise<TWebhookSubscription> {
    const response = await this.httpClient.post<{ webhook: TWebhookSubscription }>(
      '/admin/webhook.rotateSecret',
      params,
    );
    if (response.success && response.result) {
      return response.result.webhook;
    }
    throw new LinkedApiError(
      (response.error?.type ?? 'httpError') as TLinkedApiErrorType,
      response.error?.message ?? 'Failed to rotate webhook secret',
    );
  }

  /** Select event types or namespace wildcards. Pass null for all events; test events always deliver. */
  public async setEvents(params: TSetWebhookEventsParams): Promise<TWebhookSubscription> {
    const response = await this.httpClient.post<{ webhook: TWebhookSubscription }>(
      '/admin/webhook.setEvents',
      params,
    );
    if (response.success && response.result) {
      return response.result.webhook;
    }
    throw new LinkedApiError(
      (response.error?.type ?? 'httpError') as TLinkedApiErrorType,
      response.error?.message ?? 'Failed to set webhook events',
    );
  }

  /**
   * Return the event types a selection may name, in the server's order.
   * The catalog excludes webhook.test, which is always delivered.
   */
  public async eventTypes(): Promise<Array<string>> {
    const response = await this.httpClient.post<{ eventTypes: Array<string> }>(
      '/admin/webhook.eventTypes',
    );
    if (response.success && response.result) {
      return response.result.eventTypes;
    }
    throw new LinkedApiError(
      (response.error?.type ?? 'httpError') as TLinkedApiErrorType,
      response.error?.message ?? 'Failed to get webhook event types',
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
