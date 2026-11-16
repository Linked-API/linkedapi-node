import type { TBaseActionParams } from '../params';

import type { TRcSearchPeopleFilter } from './rc-search-people-filter.type';

/** Supply term, a nonempty filter, or customSearchUrl. A custom URL cannot be combined with term or filter. */
export interface TRcSearchPeopleParams extends TBaseActionParams {
  term?: string;
  filter?: TRcSearchPeopleFilter;
  customSearchUrl?: string;
  limit?: number;
}
