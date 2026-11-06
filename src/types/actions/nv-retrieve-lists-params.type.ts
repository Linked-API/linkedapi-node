import type { TBaseActionParams } from '../params';

import type { TNvListType } from './nv-list-type.type';

export interface TNvRetrieveListsParams extends TBaseActionParams {
  type: TNvListType;
}
