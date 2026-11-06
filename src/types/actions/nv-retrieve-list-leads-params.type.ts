import type { TBaseActionParams } from '../params';

export interface TNvRetrieveListLeadsParams extends TBaseActionParams {
  listId: string;
  limit?: number;
}
