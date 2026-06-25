import {
  HttpClient,
  LinkedApiError,
  TLinkedApiErrorType,
  TSetSeatsParams,
  TSetSeatsResult,
  TSubscriptionSeat,
  TSubscriptionStatus,
} from '../types';

export class AdminSubscription {
  constructor(private readonly httpClient: HttpClient) {}

  public async getStatus(): Promise<TSubscriptionStatus> {
    const response = await this.httpClient.post<TSubscriptionStatus>(
      '/admin/subscription.getStatus',
    );
    if (response.success && response.result) {
      return response.result;
    }
    throw new LinkedApiError(
      (response.error?.type ?? 'httpError') as TLinkedApiErrorType,
      response.error?.message ?? 'Failed to get subscription status',
    );
  }

  public async getSeats(): Promise<{ seats: Array<TSubscriptionSeat> }> {
    const response = await this.httpClient.post<{ seats: Array<TSubscriptionSeat> }>(
      '/admin/subscription.getSeats',
    );
    if (response.success && response.result) {
      return response.result;
    }
    throw new LinkedApiError(
      (response.error?.type ?? 'httpError') as TLinkedApiErrorType,
      response.error?.message ?? 'Failed to get seats',
    );
  }

  public async setSeats(params: TSetSeatsParams): Promise<TSetSeatsResult> {
    const response = await this.httpClient.post<TSetSeatsResult>(
      '/admin/subscription.setSeats',
      params,
    );
    if (response.success && response.result) {
      return response.result;
    }
    throw new LinkedApiError(
      (response.error?.type ?? 'httpError') as TLinkedApiErrorType,
      response.error?.message ?? 'Failed to set seats',
    );
  }
}
