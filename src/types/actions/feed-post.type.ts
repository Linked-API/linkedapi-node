import type { TPost } from './post';

export interface TFeedPost extends TPost {
  feedContext: string | null;
}
