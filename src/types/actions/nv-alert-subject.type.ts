export interface TNvAlertSubject {
  type: 'lead' | 'account';
  urn: string;
  name: string | null;
  url: string;
  saved: boolean | null;
}
