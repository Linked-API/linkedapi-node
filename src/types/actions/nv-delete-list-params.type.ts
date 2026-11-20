import type { TBaseActionParams } from '../params';

import type { TNvDeleteListUnsave } from './nv-delete-list-unsave.type';

export interface TNvDeleteListParams extends TBaseActionParams {
  listId: string;
  /**
   * What happens to the list's members. 'none' (default) keeps them saved and in your other lists;
   * 'members' also unsaves them, which removes them from your other lists too.
   */
  unsave?: TNvDeleteListUnsave;
}
