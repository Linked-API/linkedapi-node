import { TBaseActionParams, TLimitParams } from '../params';

export interface TPost {
  url: string;
  time: string;
  type: TPostType;
  activityUrn: string | null;
  author: TPostAuthor | null;
  reposter: TPostReposter | null;
  repostText: string | null;
  hashtags: ReadonlyArray<string>;
  mentions: ReadonlyArray<string>;
  externalLinks: ReadonlyArray<string>;
  text: string | null;
  images: ReadonlyArray<string> | null;
  documentSlides: ReadonlyArray<string>;
  hasVideo: boolean;
  videoThumbnail: string | null;
  hasPoll: boolean;
  reactionsCount: number;
  commentsCount: number;
  repostsCount: number;
  comments?: ReadonlyArray<TPostComment>;
  reactions?: ReadonlyArray<TPostReaction>;
}

export const POST_TYPE = {
  original: 'original',
  repost: 'repost',
} as const;
export type TPostType = (typeof POST_TYPE)[keyof typeof POST_TYPE];

export const POST_ACTOR_TYPE = {
  company: 'company',
  person: 'person',
} as const;
export type TPostActorType = (typeof POST_ACTOR_TYPE)[keyof typeof POST_ACTOR_TYPE];

export interface TPostPersonAuthor {
  type: typeof POST_ACTOR_TYPE.person;
  name: string | null;
  urn: string | null;
  profileUrl: string | null;
  headline: string | null;
}

export interface TPostCompanyAuthor {
  type: typeof POST_ACTOR_TYPE.company;
  name: string | null;
  urn: string | null;
  companyUrl: string | null;
}

export type TPostAuthor = TPostPersonAuthor | TPostCompanyAuthor;

export interface TPostPersonReposter {
  type: typeof POST_ACTOR_TYPE.person;
  name: string | null;
  urn: string | null;
  profileUrl: string | null;
  headline: string | null;
}

export interface TPostCompanyReposter {
  type: typeof POST_ACTOR_TYPE.company;
  name: string | null;
  urn: string | null;
  companyUrl: string | null;
}

export type TPostReposter = TPostPersonReposter | TPostCompanyReposter;

export interface TReaction {
  postUrl: string;
  time: string;
  reactionType: TReactionType;
}

export const REACTION_TYPE = {
  like: 'like',
  celebrate: 'celebrate',
  support: 'support',
  love: 'love',
  insightful: 'insightful',
  funny: 'funny',
} as const;
export type TReactionType = (typeof REACTION_TYPE)[keyof typeof REACTION_TYPE];

export interface TComment {
  postUrl: string;
  time: string;
  text: string | null;
  image: string | null;
  reactionsCount: number;
}

/**
 * A post is addressed by its URL or by its URN. Provide one of the two; when both are given, they
 * must refer to the same post.
 */
export interface TPostTargetParams {
  postUrl?: string;
  postUrn?: string;
}

export interface TReactToPostParams extends TBaseActionParams, TPostTargetParams {
  type: TReactionType;
  companyUrl?: string;
}

export interface TCommentOnPostParams extends TBaseActionParams, TPostTargetParams {
  text: string;
  companyUrl?: string;
}

export interface TCommentResult {
  commentUrn: string | null;
  commentUrl: string | null;
}

export type TCommentOnPostResult = TCommentResult;

export interface TReactToCommentParams extends TBaseActionParams {
  commentUrl: string;
  type?: TReactionType;
}

export interface TReplyToCommentParams extends TBaseActionParams {
  commentUrl: string;
  text: string;
}

export type TReplyToCommentResult = TCommentResult;

export const POST_COMMENTER_TYPE = {
  person: 'person',
  company: 'company',
} as const;
export type TPostCommenterType = (typeof POST_COMMENTER_TYPE)[keyof typeof POST_COMMENTER_TYPE];

export interface TPostComment {
  commentUrn: string | null;
  commentUrl: string | null;
  commenterUrl: string;
  commenterName: string;
  commenterHeadline: string;
  commenterType: TPostCommenterType;
  time: string;
  text: string | null;
  image: string | null;
  isReply: boolean;
  reactionsCount: number;
  repliesCount: number;
}

export const POST_ENGAGER_TYPE = {
  person: 'person',
  company: 'company',
} as const;
export type TPostEngagerType = (typeof POST_ENGAGER_TYPE)[keyof typeof POST_ENGAGER_TYPE];

export interface TPostReaction {
  engagerUrn: string | null;
  engagerUrl: string;
  engagerName: string;
  engagerHeadline: string;
  engagerType: TPostEngagerType;
  type: TReactionType;
}

export const POST_COMMENTS_SORT = {
  mostRelevant: 'mostRelevant',
  mostRecent: 'mostRecent',
} as const;
export type TPostCommentsSort = (typeof POST_COMMENTS_SORT)[keyof typeof POST_COMMENTS_SORT];

export interface TPostCommentsRetrievalConfig extends TLimitParams {
  replies?: boolean;
  sort?: TPostCommentsSort;
}

export type TPostReactionsRetrievalConfig = TLimitParams;

export interface TBaseFetchPostParams extends TBaseActionParams, TPostTargetParams {
  retrieveComments?: boolean;
  retrieveReactions?: boolean;
}

export interface TBaseFetchPostParamsWide extends TBaseFetchPostParams {
  retrieveComments: true;
  retrieveReactions: true;
}

export type TFetchPostParams<T extends TBaseFetchPostParams = TBaseFetchPostParams> = T & {
  commentsRetrievalConfig?: T['retrieveComments'] extends true
    ? TPostCommentsRetrievalConfig | undefined
    : never;
  reactionsRetrievalConfig?: T['retrieveReactions'] extends true
    ? TPostReactionsRetrievalConfig | undefined
    : never;
};

export type TFetchPostResult = TPost;

export const ATTACHMENT_TYPE = {
  image: 'image',
  video: 'video',
  document: 'document',
} as const;
export type TAttachmentType = (typeof ATTACHMENT_TYPE)[keyof typeof ATTACHMENT_TYPE];

export interface TCreatePostAttachment {
  url: string;
  type: TAttachmentType;
  name?: string;
}

/**
 * One person or company to mention in a post, bound to a `@[key]` placeholder in the text.
 *
 * `name` is what gets typed into LinkedIn's composer, which accepts no other input; the optional
 * identifier only decides which of the offered namesakes is taken. Provide at most one of `urn`,
 * `personHashedUrl` and `companyHashedUrl`.
 */
export interface TPostMention {
  key: string;
  name: string;
  urn?: string;
  personHashedUrl?: string;
  companyHashedUrl?: string;
}

/** Identifiers of a post this account has just published. */
export interface TPublishedPostResult {
  postUrl: string | null;
  postUrn: string | null;
}

export interface TCreatePostParams extends TBaseActionParams {
  text: string;
  mentions?: ReadonlyArray<TPostMention>;
  attachments?: ReadonlyArray<TCreatePostAttachment>;
  companyUrl?: string;
}

export type TCreatePostResult = TPublishedPostResult;

/** Without `text` the post is reposted as is; with `text` the commentary is published above it. */
export interface TCreateRepostParams extends TBaseActionParams, TPostTargetParams {
  text?: string;
  mentions?: ReadonlyArray<TPostMention>;
}

/** The repost is a post of this account's own, so these identify it rather than the post reshared. */
export type TCreateRepostResult = TPublishedPostResult;
