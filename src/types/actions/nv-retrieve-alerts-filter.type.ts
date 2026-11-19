export interface TNvRetrieveAlertsFilter {
  /** Owned list ID; requires latest sorting. */
  listId?: string;
  /**
   * Subjects to keep, ORed; an empty array is unrestricted. Each entry is a Sales Navigator identity or
   * hashed URL, or a `urn:li:member:<id>` / `urn:li:organization:<id>` as `nvRetrieveListLeads` and
   * `nvRetrieveListAccounts` return it.
   */
  subjects?: Array<string>;
  category?: 'lead' | 'account';
  types?: Array<string>;
  since?: string;
  excludeSuggested?: boolean;
}
