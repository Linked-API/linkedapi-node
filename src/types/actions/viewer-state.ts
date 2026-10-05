import type { TReactionType } from './post';

/**
 * Your connection degree to a person, as LinkedIn shows it next to their name.
 * @see {@link https://linkedapi.io/docs/core-concepts/#viewer-state}
 */
export const CONNECTION_DEGREE = {
  first: '1st',
  second: '2nd',
  thirdPlus: '3rd+',
} as const;
export type TConnectionDegree = (typeof CONNECTION_DEGREE)[keyof typeof CONNECTION_DEGREE];

/** Sales Navigator also filters by members of the groups you belong to. */
export const NV_CONNECTION_DEGREE_FILTER = {
  ...CONNECTION_DEGREE,
  groupMembers: 'groupMembers',
} as const;
export type TNvConnectionDegreeFilter =
  (typeof NV_CONNECTION_DEGREE_FILTER)[keyof typeof NV_CONNECTION_DEGREE_FILTER];

/** How your account relates to a person. `null` when LinkedIn shows no degree, e.g. on your own content. */
export interface TPersonViewerState {
  connectionDegree: TConnectionDegree | null;
}

/** What your account has done with a post or a comment. */
export interface TContentViewerState {
  /** `null` if you have not reacted or the page does not show it; comments read in the feed always report `null`. */
  reaction: TReactionType | null;
  /** `null` if this cannot be told. Content published as a company page you administer is `false`. */
  isOwn: boolean | null;
}
