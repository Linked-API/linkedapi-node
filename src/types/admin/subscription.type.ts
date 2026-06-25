export interface TSubscriptionStatus {
  status: 'active' | 'trialing' | 'past_due' | 'canceled' | undefined;
  eligibleForTrial: boolean;
  cancelAtPeriodEnd: boolean;
}

export interface TSubscriptionSeat {
  seatType: 'core' | 'plus';
  quantity: number;
  billingPeriod: 'month' | 'year';
}

export interface TSetSeatsParams {
  quantity: number;
  seatType: 'core' | 'plus';
  billingPeriod: 'month' | 'year';
}

export interface TSetSeatsResult {
  status: 'complete' | 'processing';
  paymentLink?: string;
}
