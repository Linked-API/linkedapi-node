import type { TBaseActionParams } from '../params';

export interface TNvSaveAccountParams extends TBaseActionParams {
  companyHashedUrl: string;
  listId?: string;
}
