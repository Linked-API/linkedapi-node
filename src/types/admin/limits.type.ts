export type TLimitCategory =
  | 'stPersonProfileViews'
  | 'stCompanyPageViews'
  | 'stConnectionRequests'
  | 'stMessages'
  | 'stSearchQueries'
  | 'stReactions'
  | 'stComments'
  | 'stPosts'
  | 'nvPersonProfileViews'
  | 'nvCompanyPageViews'
  | 'nvMessages';

export type TLimitPeriod = 'daily' | 'weekly' | 'monthly';

export interface TLimit {
  category: TLimitCategory;
  period: TLimitPeriod;
  maxValue: number;
  isEnabled: boolean;
}

export interface TLimitUsage {
  category: TLimitCategory;
  period: TLimitPeriod;
  maxValue: number;
  currentUsage: number;
  isEnabled: boolean;
}

export interface TGetLimitsParams {
  accountId: string;
}

export interface TGetLimitsUsageParams {
  accountId: string;
}

export interface TSetLimitEntry {
  category: TLimitCategory;
  period: TLimitPeriod;
  maxValue: number;
  isEnabled?: boolean;
}

export interface TSetLimitsParams {
  accountId: string;
  limits: Array<TSetLimitEntry>;
}

export interface TDeleteLimitEntry {
  category: TLimitCategory;
  period: TLimitPeriod;
}

export interface TDeleteLimitsParams {
  accountId: string;
  limits: Array<TDeleteLimitEntry>;
}

export interface TResetLimitsParams {
  accountId: string;
}
