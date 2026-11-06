import type { TNvListType } from './nv-list-type.type';

export interface TNvList {
  id: string;
  name: string;
  type: TNvListType;
  source: string;
  entityCount: number | null;
  url: string;
}
