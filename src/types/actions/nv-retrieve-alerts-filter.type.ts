export interface TNvRetrieveAlertsFilter {
  /** Owned list ID; requires latest sorting. */
  listId?: string;
  /** Recognised subject identities are ORed; an empty array is unrestricted. */
  subjects?: Array<string>;
  category?: 'lead' | 'account';
  types?: Array<string>;
  since?: string;
  excludeSuggested?: boolean;
}
