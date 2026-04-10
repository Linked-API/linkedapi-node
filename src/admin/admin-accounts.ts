import {
  HttpClient,
  LinkedApiError,
  TAccountsResult,
  TCancelConnectionSessionParams,
  TConnectionSessionResult,
  TCreateConnectionSessionResult,
  TDisconnectParams,
  TGetConnectionSessionParams,
  TLinkedApiErrorType,
  TRegenerateTokenParams,
  TRegenerateTokenResult,
} from '../types';

export class AdminAccounts {
  constructor(private readonly httpClient: HttpClient) {}

  public async getAll(): Promise<TAccountsResult> {
    const response = await this.httpClient.post<TAccountsResult>('/admin/accounts.getAll');
    if (response.success && response.result) {
      return response.result;
    }
    throw new LinkedApiError(
      (response.error?.type ?? 'httpError') as TLinkedApiErrorType,
      response.error?.message ?? 'Failed to get accounts',
    );
  }

  public async disconnect(params: TDisconnectParams): Promise<void> {
    const response = await this.httpClient.post('/admin/accounts.disconnect', params);
    if (response.success) {
      return;
    }
    throw new LinkedApiError(
      (response.error?.type ?? 'httpError') as TLinkedApiErrorType,
      response.error?.message ?? 'Failed to disconnect account',
    );
  }

  public async regenerateIdentificationToken(
    params: TRegenerateTokenParams,
  ): Promise<TRegenerateTokenResult> {
    const response = await this.httpClient.post<TRegenerateTokenResult>(
      '/admin/accounts.regenerateIdentificationToken',
      params,
    );
    if (response.success && response.result) {
      return response.result;
    }
    throw new LinkedApiError(
      (response.error?.type ?? 'httpError') as TLinkedApiErrorType,
      response.error?.message ?? 'Failed to regenerate token',
    );
  }

  public async createConnectionSession(): Promise<TCreateConnectionSessionResult> {
    const response = await this.httpClient.post<TCreateConnectionSessionResult>(
      '/admin/accounts.createConnectionSession',
    );
    if (response.success && response.result) {
      return response.result;
    }
    throw new LinkedApiError(
      (response.error?.type ?? 'httpError') as TLinkedApiErrorType,
      response.error?.message ?? 'Failed to create connection session',
    );
  }

  public async getConnectionSession(
    params: TGetConnectionSessionParams,
  ): Promise<TConnectionSessionResult> {
    const response = await this.httpClient.post<TConnectionSessionResult>(
      '/admin/accounts.getConnectionSession',
      params,
    );
    if (response.success && response.result) {
      return response.result;
    }
    throw new LinkedApiError(
      (response.error?.type ?? 'httpError') as TLinkedApiErrorType,
      response.error?.message ?? 'Failed to get connection session',
    );
  }

  public async cancelConnectionSession(params: TCancelConnectionSessionParams): Promise<void> {
    const response = await this.httpClient.post('/admin/accounts.cancelConnectionSession', params);
    if (response.success) {
      return;
    }
    throw new LinkedApiError(
      (response.error?.type ?? 'httpError') as TLinkedApiErrorType,
      response.error?.message ?? 'Failed to cancel connection session',
    );
  }
}
