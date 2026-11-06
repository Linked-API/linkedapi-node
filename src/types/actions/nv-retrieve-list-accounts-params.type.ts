import type { TBaseActionParams } from '../params';

export interface TNvRetrieveListAccountsParams extends TBaseActionParams {
  listId: string;
  limit?: number;
}
