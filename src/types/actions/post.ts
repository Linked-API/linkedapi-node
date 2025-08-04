import { TBaseActionParams } from "../params";

export interface TPost {
  url: string;
  time: string;
  type: TPostType;
  repostText: string | null;
  text: string | null;
  images: ReadonlyArray<string> | null;
  hasVideo: boolean;
  hasPoll: boolean;
  reactionCount: number;
  commentCount: number;
}

export type TPostType = "original" | "repost";

export interface TFetchPostParams extends TBaseActionParams {
  postUrl: string;
}

export type TFetchPostResult = TPost;

export interface TReaction {
  postUrl: string;
  time: string;
  reactionType: TReactionType;
}

export type TReactionType =
  | "like"
  | "celebrate"
  | "support"
  | "love"
  | "insightful"
  | "funny";

export interface TComment {
  postUrl: string;
  time: string;
  text: string | null;
  image: string | null;
  reactionCount: number;
}

export interface TReactToPostParams extends TBaseActionParams {
  postUrl: string;
  type: TReactionType;
}

export interface TCommentOnPostParams extends TBaseActionParams {
  postUrl: string;
  text: string;
}
