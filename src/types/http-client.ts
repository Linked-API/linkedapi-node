import type { TLinkedApiResponse } from "../types/responses";

export abstract class HttpClient {
  public abstract get<T>(
    url: string,
    config?: RequestInit,
  ): Promise<TLinkedApiResponse<T>>;
  public abstract post<T>(
    url: string,
    data?: unknown,
    config?: RequestInit,
  ): Promise<TLinkedApiResponse<T>>;
}
