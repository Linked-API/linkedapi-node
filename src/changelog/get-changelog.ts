import type { TChangelogResponse, TGetChangelogParams } from '../types';

/**
 * Read the public Linked API changelog.
 *
 * @throws Error with the server's error message on a non-2xx response.
 *
 * @example
 * ```typescript
 * const changelog = await getChangelog({ since: '2026-10-01' });
 * for (const release of changelog.entries) {
 *   console.log(release.date, release.items);
 * }
 * ```
 */
export async function getChangelog(params: TGetChangelogParams = {}): Promise<TChangelogResponse> {
  const { since, url = 'https://linkedapi.io/api/changelog' } = params;
  const requestUrl = new URL(url);
  if (since !== undefined) {
    requestUrl.searchParams.set('since', since instanceof Date ? since.toISOString() : since);
  }

  const response = await fetch(requestUrl.toString(), { method: 'GET' });
  if (!response.ok) {
    const errorData = (await response.json().catch((): undefined => undefined)) as
      | { error?: unknown }
      | undefined;
    throw new Error(
      typeof errorData?.error === 'string'
        ? errorData.error
        : `HTTP ${response.status}: ${response.statusText}`,
    );
  }

  return (await response.json()) as TChangelogResponse;
}
