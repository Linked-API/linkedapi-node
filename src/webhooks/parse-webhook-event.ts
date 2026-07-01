import { TWebhookEvent } from '../types';

/**
 * Parse a raw webhook request body into a typed Linked API event.
 *
 * Pass the raw HTTP body (string or Buffer) exactly as received. Discriminate the returned event on
 * its `type` field to narrow `data`.
 *
 * @throws Error when the body is not valid JSON or is missing the `id` / `type` envelope fields.
 *
 * @example
 * ```typescript
 * const event = parseWebhookEvent(rawBody);
 * if (event.type === 'workflow.completed') {
 *   console.log(event.data.workflowId, event.data.result);
 * }
 * ```
 */
export function parseWebhookEvent(rawBody: string | Buffer): TWebhookEvent {
  const text = typeof rawBody === 'string' ? rawBody : rawBody.toString('utf8');

  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    throw new Error('Invalid webhook payload: body is not valid JSON');
  }

  if (
    typeof parsed !== 'object' ||
    parsed === null ||
    typeof (parsed as { id?: unknown }).id !== 'string' ||
    typeof (parsed as { type?: unknown }).type !== 'string'
  ) {
    throw new Error('Invalid webhook payload: missing "id" or "type"');
  }

  return parsed as TWebhookEvent;
}
