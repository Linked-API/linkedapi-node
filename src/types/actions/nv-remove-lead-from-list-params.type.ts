import type { TBaseActionParams } from '../params';

export interface TNvRemoveLeadFromListParams extends TBaseActionParams {
  personHashedUrl: string;
  listId: string;
}
