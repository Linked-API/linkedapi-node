import type { TBaseActionParams } from '../params';

export interface TNvSaveLeadParams extends TBaseActionParams {
  personHashedUrl: string;
  listId?: string;
}
