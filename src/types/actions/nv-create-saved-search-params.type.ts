import type { TBaseActionParams } from '../params';

export interface TNvCreateSavedSearchParams extends TBaseActionParams {
  type: 'lead' | 'account';
  customSearchUrl: string;
}
