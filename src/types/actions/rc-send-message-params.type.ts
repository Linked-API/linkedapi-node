import type { TBaseActionParams } from '../params';

/** Paid InMail credits are refused unless allowPaidCredit is explicitly true. */
export type TRcSendMessageParams = TBaseActionParams & {
  text: string;
  allowPaidCredit?: boolean;
} & (
    | { personUrl: string; subject: string; threadId?: never }
    | { threadId: string; personUrl?: never; subject?: never }
  );
