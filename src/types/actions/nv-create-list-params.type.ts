import type { TBaseActionParams } from '../params';

import type { TNvListType } from './nv-list-type.type';

export interface TNvCreateListParams extends TBaseActionParams {
  type: TNvListType;
  name: string;
  description?: string;
}
