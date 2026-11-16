export interface TRcSearchPeopleResult {
  name: string;
  recruiterProfileUrl: string;
  headline: string;
  location: string;
  avatarUrl: string | null;
  viewerState: { connectionDegree: '1st' | '2nd' | '3rd+' | null };
}
