import type { TBaseActionParams } from '../params';

import type { TNvRetrieveAlertsFilter } from './nv-retrieve-alerts-filter.type';

export interface TNvRetrieveAlertsParams extends TBaseActionParams {
  limit?: number;
  sort?: 'latest' | 'relevance';
  filter?: TNvRetrieveAlertsFilter;
}
