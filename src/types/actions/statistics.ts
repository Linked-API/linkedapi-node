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

export interface TApiUsageStatsParams {
  start: string;
  end: string;
}

export interface TApiUsageAction {
  actionType: string;
  success: boolean;
  time: string;
}

export interface TApiUsageStatsResponse {
  success: boolean;
  result?: TApiUsageAction[];
  error?: {
    type: string;
    message: string;
  };
}
