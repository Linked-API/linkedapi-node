export interface TNvRetrieveAlertsFilter {
  category?: 'lead' | 'account';
  types?: Array<string>;
  since?: string;
  excludeSuggested?: boolean;
}
