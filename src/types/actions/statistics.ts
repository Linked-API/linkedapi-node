export interface TRetrieveSSIResult {
  ssi: number;
  industryTop: number;
  networkTop: number;
}

export interface TRetrievePerformanceResult {
  followersCount: number;
  postViewsLast7Days: number;
  profileViewsLast90Days: number;
  searchAppearancesPreviousWeek: number;
}

export interface TApiUsageParams {
  start: string;
  end: string;
}

export interface TApiUsageAction {
  actionType: string;
  success: boolean;
  time: string;
}
