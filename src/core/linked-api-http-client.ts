import { TLinkedApiResponse, LinkedApiError, HttpClient } from "../types";

export interface HttpClientConfig {
  headers: Record<string, string>;
}
export class LinkedApiHttpClient extends HttpClient {
  private readonly baseUrl: string;
  private readonly headers: Record<string, string>;

  constructor(config: HttpClientConfig) {
    super();
    this.baseUrl = "https://api.linkedapi.io";
    this.headers = {
      "Content-Type": "application/json",
      ...config.headers,
    };
  }

  private async handleResponse<T>(
    response: Response,
  ): Promise<TLinkedApiResponse<T>> {
    if (response.ok) {
      return (await response.json()) as TLinkedApiResponse<T>;
    }

    try {
      const errorData = await response.json();
      if (errorData?.error) {
        throw new LinkedApiError(
          errorData.error.type,
          errorData.error.message,
          errorData,
        );
      } else {
        throw new LinkedApiError(
          `HTTP ${response.status}: ${response.statusText}`,
          "HTTP_ERROR",
          {
            status: response.status,
            statusText: response.statusText,
            url: response.url,
          },
        );
      }
    } catch (e) {
      if (e instanceof LinkedApiError) {
        throw e;
      }
      throw new LinkedApiError(
        `HTTP ${response.status}: ${response.statusText}`,
        "HTTP_ERROR",
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

    if (error instanceof TypeError && error.message === "Failed to fetch") {
      throw new LinkedApiError(
        "Network error: No response received",
        "NETWORK_ERROR",
        error,
      );
    }

    throw new LinkedApiError(
      `Request error: ${(error as Error).message}`,
      "REQUEST_ERROR",
      { message: (error as Error).message },
    );
  }

  public async get<T>(
    url: string,
    config?: RequestInit,
  ): Promise<TLinkedApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseUrl}${url}`, {
        ...config,
        method: "GET",
        headers: this.headers,
      });
      return this.handleResponse<T>(response);
    } catch (error) {
      this.handleError(error);
    }
  }

  public async post<T>(
    url: string,
    data?: unknown,
    config?: RequestInit,
  ): Promise<TLinkedApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseUrl}${url}`, {
        ...config,
        method: "POST",
        headers: this.headers,
        body: data ? JSON.stringify(data) : null,
      });
      return this.handleResponse<T>(response);
    } catch (error) {
      this.handleError(error);
    }
  }
}
