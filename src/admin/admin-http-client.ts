import { HttpClient, LinkedApiError, TLinkedApiErrorType, TLinkedApiResponse } from '../types';
import type { TAdminConfig } from '../types/admin/admin-config.type';

export function buildAdminHttpClient(
  config: TAdminConfig,
  client: string,
  baseUrl: string = 'https://api.linkedapi.io',
): HttpClient {
  return new AdminHttpClient(config, client, baseUrl);
}

class AdminHttpClient extends HttpClient {
  private readonly baseUrl: string;
  private readonly headers: Record<string, string>;

  constructor(config: TAdminConfig, client: string, baseUrl: string) {
    super();
    this.baseUrl = baseUrl;
    this.headers = {
      'Content-Type': 'application/json',
      'linked-api-token': config.linkedApiToken,
      client: client,
    };
  }

  private async handleResponse<T>(response: Response): Promise<TLinkedApiResponse<T>> {
    if (response.ok) {
      return (await response.json()) as TLinkedApiResponse<T>;
    }

    try {
      const errorData = await response.json();
      throw new LinkedApiError(
        errorData.error.type as TLinkedApiErrorType,
        errorData.error.message,
        errorData,
      );
    } catch (e) {
      if (e instanceof LinkedApiError) {
        throw e;
      }
      throw new LinkedApiError(
        'httpError' as TLinkedApiErrorType,
        `HTTP ${response.status}: ${response.statusText}`,
        {
          status: response.status,
          statusText: response.statusText,
          url: response.url,
        },
      );
    }
  }

  private handleError(error: unknown): never {
    if (error instanceof LinkedApiError) {
      throw error;
    }

    throw new LinkedApiError(
      'httpError' as TLinkedApiErrorType,
      `Request error: ${(error as Error).message}`,
      { error },
    );
  }

  public async get<T>(url: string): Promise<TLinkedApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseUrl}${url}`, {
        method: 'GET',
        headers: this.headers,
      });
      return this.handleResponse<T>(response);
    } catch (error) {
      this.handleError(error);
    }
  }

  public async post<T>(url: string, data?: unknown): Promise<TLinkedApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseUrl}${url}`, {
        method: 'POST',
        headers: this.headers,
        body: data ? JSON.stringify(data) : null,
      });
      return this.handleResponse<T>(response);
    } catch (error) {
      this.handleError(error);
    }
  }

  public async delete<T>(url: string): Promise<TLinkedApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseUrl}${url}`, {
        method: 'DELETE',
        headers: this.headers,
      });
      return this.handleResponse<T>(response);
    } catch (error) {
      this.handleError(error);
    }
  }
}
