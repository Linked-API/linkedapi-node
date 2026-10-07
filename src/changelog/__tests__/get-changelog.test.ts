import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';

import type { TChangelogResponse } from '../../types';
import { getChangelog } from '../get-changelog';

const CHANGELOG: TChangelogResponse = {
  since: null,
  count: 1,
  entries: [
    {
      date: '2026-10-05',
      items: [
        {
          title: 'Webhook signing',
          body: 'Verify signed deliveries with the SDK.',
          docs: '/docs/webhooks',
        },
      ],
    },
  ],
};

let fetchMock: jest.SpiedFunction<typeof fetch>;

beforeEach((): void => {
  fetchMock = jest
    .spyOn(globalThis, 'fetch')
    .mockResolvedValue(new Response(JSON.stringify(CHANGELOG)));
});

afterEach((): void => {
  jest.restoreAllMocks();
});

describe('getChangelog', (): void => {
  it('GETs the public endpoint without a token and returns the raw route shape', async (): Promise<void> => {
    await expect(getChangelog()).resolves.toEqual(CHANGELOG);
    expect(fetchMock).toHaveBeenCalledWith('https://linkedapi.io/api/changelog', { method: 'GET' });
  });

  it.each([
    ['2026-10-01', '2026-10-01'],
    ['2026-10-01T12:34:56Z', '2026-10-01T12%3A34%3A56Z'],
    ['2026-10-01T12:34:56+02:00', '2026-10-01T12%3A34%3A56%2B02%3A00'],
  ])(
    'encodes since %s without changing its meaning',
    async (since, encodedSince): Promise<void> => {
      fetchMock.mockResolvedValue(
        new Response(
          JSON.stringify({
            ...CHANGELOG,
            since,
          }),
        ),
      );
      await expect(getChangelog({ since })).resolves.toEqual({
        ...CHANGELOG,
        since,
      });
      expect(fetchMock).toHaveBeenCalledWith(
        `https://linkedapi.io/api/changelog?since=${encodedSince}`,
        {
          method: 'GET',
        },
      );
    },
  );

  it('serialises a Date to ISO', async (): Promise<void> => {
    await getChangelog({ since: new Date('2026-10-01T12:34:56+02:00') });
    expect(fetchMock).toHaveBeenCalledWith(
      'https://linkedapi.io/api/changelog?since=2026-10-01T10%3A34%3A56.000Z',
      { method: 'GET' },
    );
  });

  it('allows an endpoint override and builds its query with URLSearchParams', async (): Promise<void> => {
    await getChangelog({
      url: 'http://127.0.0.1:3000/api/changelog?source=sdk',
      since: '2026-10-01',
    });
    expect(fetchMock).toHaveBeenCalledWith(
      'http://127.0.0.1:3000/api/changelog?source=sdk&since=2026-10-01',
      { method: 'GET' },
    );
  });

  it.each([400, 500])(
    'throws the server error message on HTTP %i',
    async (status): Promise<void> => {
      const message =
        status === 400 ? 'since must be an ISO 8601 date or a zoned instant' : 'Server error';
      fetchMock.mockResolvedValue(
        new Response(JSON.stringify({ error: message }), {
          status,
        }),
      );
      await expect(getChangelog({ since: 'invalid' })).rejects.toThrow(message);
    },
  );

  it('reports the HTTP status when an error response is not JSON', async (): Promise<void> => {
    fetchMock.mockResolvedValue(
      new Response('Bad Gateway', {
        status: 502,
        statusText: 'Bad Gateway',
      }),
    );
    await expect(getChangelog()).rejects.toThrow('HTTP 502: Bad Gateway');
  });
});
