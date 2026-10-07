import { afterEach, describe, expect, it, jest } from '@jest/globals';
import { createHmac } from 'node:crypto';
import { IncomingMessage } from 'node:http';
import { Socket } from 'node:net';

import type { TVerifyWebhookSignatureParams } from '../../types';
import { verifyWebhookSignature } from '../verify-webhook-signature';
import {
  WEBHOOK_SIGNATURE_HEADER,
  WEBHOOK_SIGNATURE_TIMESTAMP_HEADER,
} from '../webhook-signature-headers';

const SECRET = '000102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f' as const;
const TIMESTAMP = '1700000000' as const;
const NOW_SECONDS = 1700000000 as const;
const ASCII_BODY = '{"id":"event-1","type":"webhook.test","data":{"message":"Hello"}}' as const;
const ASCII_SIGNATURE = '8f93c19766fe42f27da56fcb5ae11a909c406683ccc0766bd29edc52c71fd209' as const;
const UNICODE_BODY =
  '{"id":"event-2","type":"webhook.test","data":{"message":"Zoë ♥ 日本"}}' as const;
const UNICODE_SIGNATURE =
  '87f5bc51d542ce4d8b61350b35807420dce7b3473bd7ecec87211b544c299c69' as const;
const PARAMS: TVerifyWebhookSignatureParams = {
  rawBody: ASCII_BODY,
  timestamp: TIMESTAMP,
  signature: ASCII_SIGNATURE,
  secret: SECRET,
  nowSeconds: NOW_SECONDS,
};

function verifyNodeRequest(request: IncomingMessage): boolean {
  return verifyWebhookSignature({
    rawBody: ASCII_BODY,
    timestamp: request.headers[WEBHOOK_SIGNATURE_TIMESTAMP_HEADER],
    signature: request.headers[WEBHOOK_SIGNATURE_HEADER],
    secret: SECRET,
    nowSeconds: NOW_SECONDS,
  });
}

function verifyFetchHeaders(headers: Headers): boolean {
  return verifyWebhookSignature({
    rawBody: ASCII_BODY,
    timestamp: headers.get(WEBHOOK_SIGNATURE_TIMESTAMP_HEADER),
    signature: headers.get(WEBHOOK_SIGNATURE_HEADER),
    secret: SECRET,
    nowSeconds: NOW_SECONDS,
  });
}

afterEach((): void => {
  jest.restoreAllMocks();
});

describe('verifyWebhookSignature', (): void => {
  it.each([
    ['ASCII string', ASCII_BODY, ASCII_SIGNATURE],
    ['ASCII Buffer', Buffer.from(ASCII_BODY, 'utf8'), ASCII_SIGNATURE],
    ['ASCII Uint8Array', new Uint8Array(Buffer.from(ASCII_BODY, 'utf8')), ASCII_SIGNATURE],
    ['ASCII ArrayBuffer', new Uint8Array(Buffer.from(ASCII_BODY, 'utf8')).buffer, ASCII_SIGNATURE],
    ['Unicode string', UNICODE_BODY, UNICODE_SIGNATURE],
    ['Unicode Buffer', Buffer.from(UNICODE_BODY, 'utf8'), UNICODE_SIGNATURE],
    ['Unicode Uint8Array', new Uint8Array(Buffer.from(UNICODE_BODY, 'utf8')), UNICODE_SIGNATURE],
  ])('accepts the documented %s vector', (_name, rawBody, signature): void => {
    expect(
      verifyWebhookSignature({
        ...PARAMS,
        rawBody,
        signature,
      }),
    ).toBe(true);
  });

  it('rejects a tampered ArrayBuffer body', (): void => {
    const rawBody = new Uint8Array(Buffer.from(ASCII_BODY.replace('Hello', 'Forged'), 'utf8'))
      .buffer;
    expect(
      verifyWebhookSignature({
        ...PARAMS,
        rawBody,
      }),
    ).toBe(false);
  });

  it('type-checks Node IncomingMessage and Fetch Headers receiver calls without casts', (): void => {
    const request = new IncomingMessage(new Socket());
    request.headers = {
      [WEBHOOK_SIGNATURE_TIMESTAMP_HEADER]: TIMESTAMP,
      [WEBHOOK_SIGNATURE_HEADER]: ASCII_SIGNATURE,
    };
    const headers = new Headers({
      [WEBHOOK_SIGNATURE_TIMESTAMP_HEADER]: TIMESTAMP,
      [WEBHOOK_SIGNATURE_HEADER]: ASCII_SIGNATURE,
    });

    expect(verifyNodeRequest(request)).toBe(true);
    expect(verifyFetchHeaders(headers)).toBe(true);
    expect(verifyFetchHeaders(new Headers())).toBe(false);
    request.destroy();
  });

  it.each([{ timestamp: null }, { timestamp: [TIMESTAMP] as const }])(
    'rejects non-scalar timestamp header %p',
    ({ timestamp }): void => {
      expect(
        verifyWebhookSignature({
          ...PARAMS,
          timestamp,
        }),
      ).toBe(false);
    },
  );

  it.each([{ signature: null }, { signature: [ASCII_SIGNATURE] as const }])(
    'rejects non-scalar signature header %p',
    ({ signature }): void => {
      expect(
        verifyWebhookSignature({
          ...PARAMS,
          signature,
        }),
      ).toBe(false);
    },
  );

  it('rejects a null secret', (): void => {
    expect(
      verifyWebhookSignature({
        ...PARAMS,
        secret: null,
      }),
    ).toBe(false);
  });

  it('rejects a signature produced by hex-decoding the secret', (): void => {
    expect(
      verifyWebhookSignature({
        ...PARAMS,
        signature: 'cf8a7cbd4da0130448492ced3d1aaffd608738b7fff2623e27eaecd4dd54a236',
      }),
    ).toBe(false);
  });

  it('rejects a changed body, including whitespace', (): void => {
    expect(
      verifyWebhookSignature({
        ...PARAMS,
        rawBody: `${ASCII_BODY} `,
      }),
    ).toBe(false);
    expect(
      verifyWebhookSignature({
        ...PARAMS,
        rawBody: ASCII_BODY.replace('Hello', 'Forged'),
      }),
    ).toBe(false);
  });

  it('rejects a changed signature with valid shape', (): void => {
    expect(
      verifyWebhookSignature({
        ...PARAMS,
        signature: `0${ASCII_SIGNATURE.slice(1)}`,
      }),
    ).toBe(false);
  });

  it('rejects a different secret', (): void => {
    expect(
      verifyWebhookSignature({
        ...PARAMS,
        secret: `${SECRET}x`,
      }),
    ).toBe(false);
  });

  it.each([
    undefined,
    '',
    'a'.repeat(63),
    'a'.repeat(65),
    'g'.repeat(64),
    ASCII_SIGNATURE.toUpperCase(),
    `${ASCII_SIGNATURE}\n`,
    `sha256=${ASCII_SIGNATURE}`,
  ])('rejects malformed signature %p without throwing', (signature): void => {
    expect(
      verifyWebhookSignature({
        ...PARAMS,
        signature,
      }),
    ).toBe(false);
  });

  it.each([-300, 300])('accepts the default tolerance boundary at %i seconds', (offset): void => {
    expect(
      verifyWebhookSignature({
        ...PARAMS,
        nowSeconds: NOW_SECONDS + offset,
      }),
    ).toBe(true);
  });

  it.each([-301, 301])('rejects a timestamp outside tolerance at %i seconds', (offset): void => {
    expect(
      verifyWebhookSignature({
        ...PARAMS,
        nowSeconds: NOW_SECONDS + offset,
      }),
    ).toBe(false);
  });

  it.each([-60, 60])('accepts the custom tolerance boundary at %i seconds', (offset): void => {
    expect(
      verifyWebhookSignature({
        ...PARAMS,
        nowSeconds: NOW_SECONDS + offset,
        toleranceSeconds: 60,
      }),
    ).toBe(true);
  });

  it.each([-61, 61])(
    'rejects a timestamp outside custom tolerance at %i seconds',
    (offset): void => {
      expect(
        verifyWebhookSignature({
          ...PARAMS,
          nowSeconds: NOW_SECONDS + offset,
          toleranceSeconds: 60,
        }),
      ).toBe(false);
    },
  );

  it('uses the current clock when nowSeconds is omitted', (): void => {
    jest.spyOn(Date, 'now').mockReturnValue(NOW_SECONDS * 1000);
    expect(
      verifyWebhookSignature({
        ...PARAMS,
        nowSeconds: undefined,
      }),
    ).toBe(true);
    jest.spyOn(Date, 'now').mockReturnValue((NOW_SECONDS + 301) * 1000);
    expect(
      verifyWebhookSignature({
        ...PARAMS,
        nowSeconds: undefined,
      }),
    ).toBe(false);
  });

  it('accepts an integer numeric timestamp', (): void => {
    expect(
      verifyWebhookSignature({
        ...PARAMS,
        timestamp: NOW_SECONDS,
      }),
    ).toBe(true);
  });

  it.each(['1700000000.5', 1700000000.5, '1.7e9'])(
    'rejects non-integer decimal timestamp %p',
    (timestamp): void => {
      const signature = createHmac('sha256', SECRET)
        .update(`${timestamp}.${ASCII_BODY}`, 'utf8')
        .digest('hex');
      expect(
        verifyWebhookSignature({
          ...PARAMS,
          timestamp,
          signature,
        }),
      ).toBe(false);
    },
  );

  it.each([undefined, '', 'invalid', Number.NaN, Number.POSITIVE_INFINITY])(
    'rejects invalid timestamp %p',
    (timestamp): void => {
      expect(
        verifyWebhookSignature({
          ...PARAMS,
          timestamp,
        }),
      ).toBe(false);
    },
  );

  it.each([Number.NaN, Number.POSITIVE_INFINITY])(
    'rejects invalid clock %p',
    (nowSeconds): void => {
      expect(
        verifyWebhookSignature({
          ...PARAMS,
          nowSeconds,
        }),
      ).toBe(false);
    },
  );

  it.each([-1, Number.NaN, Number.POSITIVE_INFINITY])(
    'rejects invalid tolerance %p',
    (toleranceSeconds): void => {
      expect(
        verifyWebhookSignature({
          ...PARAMS,
          toleranceSeconds,
        }),
      ).toBe(false);
    },
  );

  it.each([
    undefined,
    null,
    {},
    {
      ...PARAMS,
      rawBody: null,
    },
    {
      ...PARAMS,
      rawBody: { message: 'Hello' },
    },
    {
      ...PARAMS,
      secret: undefined,
    },
    {
      ...PARAMS,
      secret: '',
    },
    {
      ...PARAMS,
      signature: 42,
    },
    {
      ...PARAMS,
      timestamp: null,
    },
  ])('returns false for malformed runtime input %p', (params: unknown): void => {
    expect(verifyWebhookSignature(params as TVerifyWebhookSignatureParams)).toBe(false);
  });

  it('exports the wire header names', (): void => {
    expect(WEBHOOK_SIGNATURE_HEADER).toBe('linked-api-signature');
    expect(WEBHOOK_SIGNATURE_TIMESTAMP_HEADER).toBe('linked-api-signature-timestamp');
  });
});
