import {
  HttpClient,
  LinkedApiError,
  TDeleteLimitsParams,
  TGetLimitsParams,
  TGetLimitsUsageParams,
  TLimit,
  TLimitUsage,
  TLinkedApiErrorType,
  TResetLimitsParams,
  TSetLimitsParams,
} from '../types';

export class AdminLimits {
  constructor(private readonly httpClient: HttpClient) {}

  public async getDefaults(): Promise<{ limits: Array<TLimit> }> {
    const response = await this.httpClient.post<{ limits: Array<TLimit> }>(
      '/admin/limits.getDefaults',
    );
    if (response.success && response.result) {
      return response.result;
    }
    throw new LinkedApiError(
      (response.error?.type ?? 'httpError') as TLinkedApiErrorType,
      response.error?.message ?? 'Failed to get default limits',
    );
  }

  public async get(params: TGetLimitsParams): Promise<{ limits: Array<TLimit> }> {
    const response = await this.httpClient.post<{ limits: Array<TLimit> }>(
      '/admin/limits.get',
      params,
    );
    if (response.success && response.result) {
      return response.result;
    }
    throw new LinkedApiError(
      (response.error?.type ?? 'httpError') as TLinkedApiErrorType,
      response.error?.message ?? 'Failed to get limits',
    );
  }

  public async getUsage(params: TGetLimitsUsageParams): Promise<{ usage: Array<TLimitUsage> }> {
    const response = await this.httpClient.post<{ usage: Array<TLimitUsage> }>(
      '/admin/limits.getUsage',
      params,
    );
    if (response.success && response.result) {
      return response.result;
    }
    throw new LinkedApiError(
      (response.error?.type ?? 'httpError') as TLinkedApiErrorType,
      response.error?.message ?? 'Failed to get limits usage',
    );
  }

  public async set(params: TSetLimitsParams): Promise<void> {
    const response = await this.httpClient.post('/admin/limits.set', params);
    if (response.success) {
      return;
    }
    throw new LinkedApiError(
      (response.error?.type ?? 'httpError') as TLinkedApiErrorType,
      response.error?.message ?? 'Failed to set limits',
    );
  }

  public async delete(params: TDeleteLimitsParams): Promise<void> {
    const response = await this.httpClient.post('/admin/limits.delete', params);
    if (response.success) {
      return;
    }
    throw new LinkedApiError(
      (response.error?.type ?? 'httpError') as TLinkedApiErrorType,
      response.error?.message ?? 'Failed to delete limits',
    );
  }

  public async resetToDefaults(params: TResetLimitsParams): Promise<void> {
    const response = await this.httpClient.post('/admin/limits.resetToDefaults', params);
    if (response.success) {
      return;
    }
    throw new LinkedApiError(
      (response.error?.type ?? 'httpError') as TLinkedApiErrorType,
      response.error?.message ?? 'Failed to reset limits',
    );
  }
}
