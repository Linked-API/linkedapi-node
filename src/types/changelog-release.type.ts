import type { TChangelogItem } from './changelog-item.type';

export interface TChangelogRelease {
  date: string;
  items: Array<TChangelogItem>;
}
