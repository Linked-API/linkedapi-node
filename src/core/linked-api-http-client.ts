import {
  TLinkedApiResponse,
  LinkedApiError,
  HttpClient,
  TLinkedApiConfig,
} from "../types";

export function buildLinkedApiHttpClient(config: TLinkedApiConfig): HttpClient {
  return new LinkedApiHttpClient(config);
}

class LinkedApiHttpClient extends HttpClient {
  private readonly baseUrl: string;
  private readonly headers: Record<string, string>;

  constructor(config: TLinkedApiConfig) {
    super();
    this.baseUrl = "https://api.linkedapi.io";
    this.headers = {
      "Content-Type": "application/json",
      "linked-api-token": config.linkedApiToken,
      "identification-token": config.identificationToken,
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
      throw new LinkedApiError(
        `HTTP ${response.status}: ${response.statusText}`,
        "HTTP_ERROR",
        errorData,
      );
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

  public async get<T>(url: string): Promise<TLinkedApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseUrl}${url}`, {
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
  ): Promise<TLinkedApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseUrl}${url}`, {
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
