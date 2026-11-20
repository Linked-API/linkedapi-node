export const NV_DELETE_LIST_UNSAVE = {
  none: 'none',
  members: 'members',
} as const;

export type TNvDeleteListUnsave =
  (typeof NV_DELETE_LIST_UNSAVE)[keyof typeof NV_DELETE_LIST_UNSAVE];
