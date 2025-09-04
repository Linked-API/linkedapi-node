import { TBaseActionParams } from '../params';

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
  repostsCount: number | null;
}

export const POST_TYPE = {
  original: 'original',
  repost: 'repost',
} as const;
export type TPostType = (typeof POST_TYPE)[keyof typeof POST_TYPE];

export interface TFetchPostParams extends TBaseActionParams {
  postUrl: string;
}

export type TFetchPostResult = TPost;

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
