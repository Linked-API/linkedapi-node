import { TBaseActionParams, TLimitParams } from '../params';

export interface TPost {
  url: string;
  time: string;
  type: TPostType;
  repostText: string | null;
  text: string | null;
  images: ReadonlyArray<string> | null;
  hasVideo: boolean;
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

export interface TReactToPostParams extends TBaseActionParams {
  postUrl: string;
  type: TReactionType;
}

export interface TCommentOnPostParams extends TBaseActionParams {
  postUrl: string;
  text: string;
}

export const POST_COMMENTER_TYPE = {
  person: 'person',
  company: 'company',
} as const;
export type TPostCommenterType = (typeof POST_COMMENTER_TYPE)[keyof typeof POST_COMMENTER_TYPE];

export interface TPostComment {
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

export interface TBaseFetchPostParams extends TBaseActionParams {
  postUrl: string;
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
