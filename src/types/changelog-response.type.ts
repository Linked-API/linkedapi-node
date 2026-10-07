import type { TChangelogRelease } from './changelog-release.type';

export interface TChangelogResponse {
  since: string | null;
  count: number;
  entries: Array<TChangelogRelease>;
}
