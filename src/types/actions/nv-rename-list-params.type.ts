import type { TBaseActionParams } from '../params';

export interface TNvRenameListParams extends TBaseActionParams {
  listId: string;
  name: string;
}
