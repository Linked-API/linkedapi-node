import type { TBaseActionParams } from '../params';

export interface TNvRetrieveSavedSearchesParams extends TBaseActionParams {
  type: 'lead' | 'account';
}
