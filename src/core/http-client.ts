import type {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  CreateAxiosDefaults,
  InternalAxiosRequestConfig,
} from "axios";
import axios from "axios";
import type { TLinkedApiResponse } from "../types/responses";
import { LinkedApiError } from "../types/errors";

export interface HttpClientConfig {
  headers: Record<string, string>;
}

export class HttpClient {
  private client: AxiosInstance;

  constructor(config: HttpClientConfig) {
    this.client = axios.create({
      baseURL: "https://api.linkedapi.io",
      headers: {
        "Content-Type": "application/json",
        ...config.headers,
      },
    } as CreateAxiosDefaults);

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    this.client.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        return config;
      },
      (error: unknown) => {
        return Promise.reject(error);
      },
    );

    this.client.interceptors.response.use(
      (response: AxiosResponse) => {
        return response;
      },
      (error: unknown) => {
        if (axios.isAxiosError(error)) {
          if (error.response) {
            if (error.response.data?.error) {
              throw new LinkedApiError(
                error.response.data.error.type,
                error.response.data.error.message,
                error.response.data,
              );
            } else {
              throw new LinkedApiError(
                `HTTP ${error.response.status}: ${error.response.statusText}`,
                "HTTP_ERROR",
                {
                  status: error.response.status,
                  statusText: error.response.statusText,
                  url: `${error.config?.baseURL ?? ""}${error.config?.url ?? ""}`,
                },
              );
            }
          } else if (error.request) {
            throw new LinkedApiError(
              "Network error: No response received",
              "NETWORK_ERROR",
              error.request,
            );
          } else {
            throw new LinkedApiError(
              `Request error: ${error.message}`,
              "REQUEST_ERROR",
              { message: error.message },
            );
          }
        } else {
          throw new LinkedApiError(
            "Unknown error occurred",
            "UNKNOWN_ERROR",
            error,
          );
        }
      },
    );
  }

  public async get<T>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<TLinkedApiResponse<T>> {
    const response = await this.client.get<TLinkedApiResponse<T>>(url, config);
    return response.data;
  }

  public async post<T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<TLinkedApiResponse<T>> {
    const response = await this.client.post<TLinkedApiResponse<T>>(
      url,
      data,
      config,
    );
    return response.data;
  }
}
