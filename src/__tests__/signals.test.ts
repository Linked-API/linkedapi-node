import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';

import LinkedApi, {
  LINKED_API_ERROR,
  LinkedApiError,
  parseWebhookEvent,
  SIGNAL_EVENT_TYPE,
  SIGNAL_TYPE,
  TSignal,
  TSignalEvent,
  TSignalWebhookEvent,
  TWebhookEventSelector,
} from '../index';

const SIGNAL_ID = 'sigsub-1' as const;
const SIGNAL: TSignal = {
  id: SIGNAL_ID,
  type: SIGNAL_TYPE.postSearch,
  label: 'lead-1042',
  status: 'active',
  stoppedReason: null,
  createdAt: '2026-10-12T10:00:00Z',
  baselineAt: null,
  lastCheckedAt: null,
  nextCheckAt: '2026-10-12T10:20:00Z',
  term: ['climate tech', 'carbon capture'],
  filter: { contentType: 'videos' },
};
const LIST_ALERTS_SIGNAL: TSignal = {
  id: 'sigsub-2',
  type: SIGNAL_TYPE.listAlerts,
  label: null,
  status: 'active',
  stoppedReason: null,
  createdAt: '2026-11-19T08:28:59Z',
  baselineAt: null,
  lastCheckedAt: null,
  nextCheckAt: null,
  listId: '7224792536903495680',
};
const CONNECTION_EVENT: TSignalEvent = {
  id: 'sigev-1',
  signalId: SIGNAL_ID,
  signalType: SIGNAL_TYPE.network,
  label: null,
  type: SIGNAL_EVENT_TYPE.connectionAccepted,
  detectedAt: '2026-10-12T11:35:00Z',
  personUrn: 'urn:li:member:987654321',
  personUrl: 'https://www.linkedin.com/in/person2',
};

let fetchMock: jest.SpiedFunction<typeof fetch>;
let linkedApi: LinkedApi;

beforeEach((): void => {
  fetchMock = jest.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('Unexpected request'));
  linkedApi = new LinkedApi({
    linkedApiToken: 'test',
    identificationToken: 'test',
    baseUrl: 'https://api.test',
  });
});

afterEach((): void => {
  jest.restoreAllMocks();
});

function respond(result: unknown): void {
  fetchMock.mockResolvedValueOnce(
    new Response(
      JSON.stringify({
        success: true,
        result,
      }),
    ),
  );
}

function sentRequest(): { url: unknown; method: unknown; body: unknown } {
  const [url, init] = fetchMock.mock.calls[0] ?? [];

  return {
    url,
    method: init?.method,
    body: init?.body ? JSON.parse(String(init.body)) : null,
  };
}

interface TSignalCallCase {
  name: string;
  call: (api: LinkedApi) => Promise<unknown>;
  url: string;
  method: string;
  body: unknown;
  result: unknown;
}

const CASES: ReadonlyArray<TSignalCallCase> = [
  {
    name: 'createSignal',
    call: (api) =>
      api.createSignal({
        type: SIGNAL_TYPE.postSearch,
        term: ['climate tech', 'carbon capture'],
        filter: { contentType: 'videos' },
        label: 'lead-1042',
      }),
    url: 'https://api.test/signals',
    method: 'POST',
    body: {
      type: 'postSearch',
      term: ['climate tech', 'carbon capture'],
      filter: { contentType: 'videos' },
      label: 'lead-1042',
    },
    result: SIGNAL,
  },
  {
    name: 'createSignal for list alerts',
    call: (api) =>
      api.createSignal({
        type: SIGNAL_TYPE.listAlerts,
        listId: '7224792536903495680',
      }),
    url: 'https://api.test/signals',
    method: 'POST',
    body: {
      type: 'listAlerts',
      listId: '7224792536903495680',
    },
    result: LIST_ALERTS_SIGNAL,
  },
  {
    name: 'getSignals with filters',
    call: (api) =>
      api.getSignals({
        type: SIGNAL_TYPE.postSearch,
        status: 'active',
      }),
    url: 'https://api.test/signals?type=postSearch&status=active',
    method: 'GET',
    body: null,
    result: { signals: [SIGNAL] },
  },
  {
    name: 'getSignals with an unset filter',
    call: (api) =>
      api.getSignals({
        type: SIGNAL_TYPE.network,
        status: undefined,
      }),
    url: 'https://api.test/signals?type=network',
    method: 'GET',
    body: null,
    result: { signals: [] },
  },
  {
    name: 'getSignals without filters',
    call: (api) => api.getSignals(),
    url: 'https://api.test/signals',
    method: 'GET',
    body: null,
    result: { signals: [] },
  },
  {
    name: 'getSignal',
    call: (api) => api.getSignal({ signalId: SIGNAL_ID }),
    url: 'https://api.test/signals/sigsub-1',
    method: 'GET',
    body: null,
    result: SIGNAL,
  },
  {
    name: 'pauseSignal',
    call: (api) => api.pauseSignal({ signalId: SIGNAL_ID }),
    url: 'https://api.test/signals/sigsub-1/pause',
    method: 'POST',
    body: null,
    result: {
      ...SIGNAL,
      status: 'paused',
    },
  },
  {
    name: 'resumeSignal',
    call: (api) => api.resumeSignal({ signalId: SIGNAL_ID }),
    url: 'https://api.test/signals/sigsub-1/resume',
    method: 'POST',
    body: null,
    result: SIGNAL,
  },
  {
    name: 'deleteSignal',
    call: (api) => api.deleteSignal({ signalId: 'sigsub-a/b' }),
    url: 'https://api.test/signals/sigsub-a%2Fb',
    method: 'DELETE',
    body: null,
    result: { deleted: true },
  },
  {
    name: 'pollSignals',
    call: (api) =>
      api.pollSignals({
        since: '2026-10-12T00:00:00Z',
        signalType: SIGNAL_TYPE.network,
        eventType: SIGNAL_EVENT_TYPE.connectionAccepted,
      }),
    url: 'https://api.test/signals/poll',
    method: 'POST',
    body: {
      since: '2026-10-12T00:00:00Z',
      signalType: 'network',
      eventType: 'connectionAccepted',
    },
    result: { events: [CONNECTION_EVENT] },
  },
];

describe('signals', (): void => {
  it.each(CASES)(
    '$name calls $method $url',
    async ({ call, url, method, body, result }): Promise<void> => {
      respond(result);

      expect(await call(linkedApi)).toEqual({
        data: result,
        errors: [],
      });
      expect(sentRequest()).toEqual({
        url,
        method,
        body,
      });
    },
  );

  it('throws the signal error type Core answers with', async (): Promise<void> => {
    fetchMock.mockResolvedValueOnce(
      new Response(
        JSON.stringify({
          success: false,
          error: {
            type: 'signalNotFound',
            message: 'Signal not found',
          },
        }),
        { status: 400 },
      ),
    );

    const error = await linkedApi.getSignal({ signalId: SIGNAL_ID }).catch((caught) => caught);

    expect(error).toBeInstanceOf(LinkedApiError);
    expect((error as LinkedApiError).type).toBe(LINKED_API_ERROR.signalNotFound);
  });

  it('parses a signal webhook and narrows its data by type', (): void => {
    const selector: TWebhookEventSelector = 'signal.*';
    const event: TSignalWebhookEvent = {
      id: 'sigev-2',
      type: 'signal.commentAdded',
      createdAt: '2026-10-12T16:40:00.000Z',
      data: {
        id: 'sigev-2',
        accountId: 'account-1',
        signalId: SIGNAL_ID,
        signalType: SIGNAL_TYPE.postEngagement,
        label: 'launch-post',
        type: SIGNAL_EVENT_TYPE.commentAdded,
        detectedAt: '2026-10-12T16:40:00Z',
        postUrl: 'https://www.linkedin.com/feed/update/urn:li:activity:1234567890123456789',
        comment: {
          commentUrn: null,
          commentUrl: null,
          author: {
            type: 'person',
            name: 'John Doe',
            profileUrl: 'https://www.linkedin.com/in/john-doe',
            headline: 'Head of Growth',
            viewerState: { connectionDegree: '2nd' },
          },
          commenterUrl: 'https://www.linkedin.com/in/john-doe',
          commenterName: 'John Doe',
          commenterHeadline: 'Head of Growth',
          commenterType: 'person',
          time: '2h',
          text: 'Interested',
          image: null,
          isReply: true,
          parentCommentUrn: 'urn:li:comment:(activity:1,2)',
          reactionsCount: 0,
          repliesCount: 0,
          viewerState: {
            reaction: null,
            isOwn: false,
          },
        },
      },
    };

    const parsed = parseWebhookEvent(JSON.stringify(event));

    expect(selector).toBe('signal.*');
    expect(parsed).toEqual(event);
    if (parsed.type !== 'signal.commentAdded') {
      throw new Error(`Unexpected ${parsed.type}`);
    }
    expect(parsed.data.comment.parentCommentUrn).toBe('urn:li:comment:(activity:1,2)');
  });
});
