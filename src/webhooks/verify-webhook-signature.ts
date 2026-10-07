import { createHmac, timingSafeEqual } from 'node:crypto';

import type { TVerifyWebhookSignatureParams } from '../types';

/**
 * Verify a signed webhook before parsing its raw request body.
 *
 * The secret is the literal UTF-8 text returned by the management API; never hex-decode it.
 * The timestamp is integer Unix seconds. The default tolerance is 300 seconds in either direction;
 * toleranceSeconds must be finite and non-negative. To verify a stored delivery later, inject
 * nowSeconds with the verification time to use. Malformed inputs return false.
 *
 * @example
 * ```typescript
 * const isValid = verifyWebhookSignature({
 *   rawBody,
 *   timestamp: request.headers[WEBHOOK_SIGNATURE_TIMESTAMP_HEADER],
 *   signature: request.headers[WEBHOOK_SIGNATURE_HEADER],
 *   secret: process.env.LINKED_API_WEBHOOK_SECRET,
 * });
 * ```
 */
export function verifyWebhookSignature(params: TVerifyWebhookSignatureParams): boolean {
  try {
    const {
      rawBody,
      timestamp,
      signature,
      secret,
      nowSeconds = Math.floor(Date.now() / 1000),
      toleranceSeconds = 300,
    } = params;

    if (
      typeof signature !== 'string' ||
      signature.length !== 64 ||
      !/^[0-9a-f]{64}$/.test(signature) ||
      typeof secret !== 'string' ||
      secret.length === 0 ||
      (typeof rawBody !== 'string' &&
        !(rawBody instanceof Uint8Array) &&
        !(rawBody instanceof ArrayBuffer))
    ) {
      return false;
    }

    if (
      typeof timestamp !== 'number' &&
      (typeof timestamp !== 'string' || !/^-?\d+$/.test(timestamp))
    ) {
      return false;
    }

    const sentAt = Number(timestamp);
    if (
      !Number.isSafeInteger(sentAt) ||
      !Number.isFinite(nowSeconds) ||
      !Number.isFinite(toleranceSeconds) ||
      toleranceSeconds < 0 ||
      Math.abs(nowSeconds - sentAt) > toleranceSeconds
    ) {
      return false;
    }

    const bodyBytes = rawBody instanceof ArrayBuffer ? new Uint8Array(rawBody) : rawBody;
    const expected = createHmac('sha256', secret)
      .update(`${timestamp}.`, 'utf8')
      .update(bodyBytes)
      .digest();
    return timingSafeEqual(expected, Buffer.from(signature, 'hex'));
  } catch {
    return false;
  }
}
