import type { TBaseActionParams } from '../params';

export interface TNvRemoveAccountFromListParams extends TBaseActionParams {
  companyHashedUrl: string;
  listId: string;
}
