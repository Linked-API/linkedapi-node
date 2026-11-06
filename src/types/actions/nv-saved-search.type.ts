export interface TNvSavedSearch {
  id: string;
  name: string;
  type: 'lead' | 'account';
  url: string;
  keywords: string | null;
  createdAt: string | null;
  lastViewedAt: string | null;
  newResultsCount: number | null;
}
