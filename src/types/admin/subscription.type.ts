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

export interface TSubscriptionProduct {
  id: string;
  seatType: 'core' | 'plus';
  billingPeriod: 'month' | 'year';
  unitPrice: number;
  currency: 'usd' | 'eur';
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

export interface TBillingLinkResult {
  stripeLink: string;
}

export interface TCancelResult {
  cancelAtDate: string;
}
