export const INBOX_TYPE = {
  st: 'st',
  nv: 'nv',
  rc: 'rc',
} as const;

export type TInboxType = (typeof INBOX_TYPE)[keyof typeof INBOX_TYPE];
