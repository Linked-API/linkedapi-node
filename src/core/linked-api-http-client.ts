import {
  HttpClient,
  LinkedApiError,
  TLinkedApiConfig,
  TLinkedApiErrorType,
  TLinkedApiResponse,
} from '../types';

export function buildLinkedApiHttpClient(
  config: TLinkedApiConfig,
  client: string,
  baseUrl: string = 'https://api.linkedapi.io',
): HttpClient {
  return new LinkedApiHttpClient(config, client, baseUrl);
}

class LinkedApiHttpClient extends HttpClient {
  private readonly baseUrl: string;
  private readonly headers: Record<string, string>;

  constructor(config: TLinkedApiConfig, client: string, baseUrl: string) {
    super();
    this.baseUrl = baseUrl;
    this.headers = {
      'Content-Type': 'application/json',
      'linked-api-token': config.linkedApiToken,
      'identification-token': config.identificationToken,
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
