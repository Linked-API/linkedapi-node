import { TBaseActionParams } from '../params';

import { POST_ACTOR_TYPE, TPostType } from './post';
import type { TContentViewerState, TPersonViewerState } from './viewer-state';

export const POST_SEARCH_SORT = {
  topMatch: 'topMatch',
  latest: 'latest',
} as const;
export type TPostSearchSort = (typeof POST_SEARCH_SORT)[keyof typeof POST_SEARCH_SORT];

export const POST_SEARCH_DATE_POSTED = {
  past24Hours: 'past24Hours',
  pastWeek: 'pastWeek',
  pastMonth: 'pastMonth',
} as const;
export type TPostSearchDatePosted =
  (typeof POST_SEARCH_DATE_POSTED)[keyof typeof POST_SEARCH_DATE_POSTED];

export const POST_SEARCH_CONTENT_TYPE = {
  videos: 'videos',
  images: 'images',
  jobPosts: 'jobPosts',
  liveVideos: 'liveVideos',
  documents: 'documents',
} as const;
export type TPostSearchContentType =
  (typeof POST_SEARCH_CONTENT_TYPE)[keyof typeof POST_SEARCH_CONTENT_TYPE];

export const POST_SEARCH_POSTED_BY = {
  me: 'me',
  firstConnections: 'firstConnections',
  peopleYouFollow: 'peopleYouFollow',
} as const;
export type TPostSearchPostedBy =
  (typeof POST_SEARCH_POSTED_BY)[keyof typeof POST_SEARCH_POSTED_BY];

/**
 * One person to narrow a post search by. `name` is what gets typed into LinkedIn's filter panel,
 * which accepts no other input; the optional identifier only decides which of the offered namesakes
 * is taken.
 */
export interface TPostSearchPersonFilter {
  name: string;
  urn?: string;
  personHashedUrl?: string;
}

/** One company to narrow a post search by. Same contract as {@link TPostSearchPersonFilter}. */
export interface TPostSearchCompanyFilter {
  name: string;
  urn?: string;
  companyHashedUrl?: string;
}

/** A plain string is shorthand for the name alone: `"Bill Gates"` means `{ name: "Bill Gates" }`. */
export type TPostSearchPersonFilterEntry = string | TPostSearchPersonFilter;

/** A plain string is shorthand for the name alone: `"Example Co"` means `{ name: "Example Co" }`. */
export type TPostSearchCompanyFilterEntry = string | TPostSearchCompanyFilter;

/**
 * Filtering criteria for the LinkedIn content search. Every specified field is applied, or the
 * action fails. Ignored entirely when `customSearchUrl` is specified.
 */
export interface TPostSearchFilter {
  sort?: TPostSearchSort;
  datePosted?: TPostSearchDatePosted;
  contentType?: TPostSearchContentType;
  postedBy?: TPostSearchPostedBy[];
  fromMembers?: TPostSearchPersonFilterEntry[];
  fromCompanies?: TPostSearchCompanyFilterEntry[];
  mentioningMembers?: TPostSearchPersonFilterEntry[];
  mentioningCompanies?: TPostSearchCompanyFilterEntry[];
  authorCompanies?: TPostSearchCompanyFilterEntry[];
  authorIndustries?: string[];
}

export interface TSearchPostsParams extends TBaseActionParams {
  term?: string;
  /** Defaults to 10, maximum 100 — or 20 when child actions are attached. */
  limit?: number;
  filter?: TPostSearchFilter;
  customSearchUrl?: string;
}

export interface TSearchPostPersonActor {
  type: typeof POST_ACTOR_TYPE.person;
  name: string | null;
  profileUrl: string | null;
  headline: string | null;
}

export interface TSearchPostPersonAuthor extends TSearchPostPersonActor {
  viewerState: TPersonViewerState;
}

export interface TSearchPostCompanyActor {
  type: typeof POST_ACTOR_TYPE.company;
  name: string | null;
  companyUrl: string | null;
}

/**
 * Whoever a search result attributes content to — its author, or the actor that reshared it.
 *
 * Unlike the actors of a post returned by `fetchPost`, these carry no `urn`: the URN is read from
 * identity anchors on the post's own page, and a search result list has none of them.
 */
export type TSearchPostActor = TSearchPostPersonActor | TSearchPostCompanyActor;

export interface TSearchPostResult {
  url: string;
  activityUrn: string | null;
  time: string;
  type: TPostType;
  author: TSearchPostPersonAuthor | TSearchPostCompanyActor | null;
  /** Non-null only when `type` is `repost`. */
  reposter: TSearchPostActor | null;
  text: string | null;
  repostText: string | null;
  hashtags: ReadonlyArray<string>;
  mentions: ReadonlyArray<string>;
  externalLinks: ReadonlyArray<string>;
  images: ReadonlyArray<string>;
  documentSlides: ReadonlyArray<string>;
  hasVideo: boolean;
  videoThumbnail: string | null;
  hasPoll: boolean;
  reactionsCount: number;
  commentsCount: number;
  repostsCount: number;
  viewerState: TContentViewerState;
}
