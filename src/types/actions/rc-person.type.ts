import type { TRcSearchPeopleResult } from './rc-search-people-result.type';

export interface TRcPerson extends TRcSearchPeopleResult {
  publicUrl: string;
  industry: string | null;
}
