import type { TPostComment, TPostReactionActor, TReactionType } from './post';
import type { TProfileViewer } from './profile-viewer.type';
import type { TPostSearchFilter, TSearchPostResult } from './search-posts';

export const SIGNAL_TYPE = {
  personPosts: 'personPosts',
  companyPosts: 'companyPosts',
  postSearch: 'postSearch',
  postEngagement: 'postEngagement',
  network: 'network',
  profileViewers: 'profileViewers',
} as const;
export type TSignalType = (typeof SIGNAL_TYPE)[keyof typeof SIGNAL_TYPE];

export const SIGNAL_STATUS = {
  active: 'active',
  paused: 'paused',
  stopped: 'stopped',
} as const;
export type TSignalStatus = (typeof SIGNAL_STATUS)[keyof typeof SIGNAL_STATUS];

export const SIGNAL_STOPPED_REASON = {
  targetNotFound: 'targetNotFound',
  watchPeriodEnded: 'watchPeriodEnded',
} as const;
export type TSignalStoppedReason =
  (typeof SIGNAL_STOPPED_REASON)[keyof typeof SIGNAL_STOPPED_REASON];

export const SIGNAL_EVENT_TYPE = {
  postPublished: 'postPublished',
  postFound: 'postFound',
  commentAdded: 'commentAdded',
  reactionAdded: 'reactionAdded',
  profileViewed: 'profileViewed',
  connectionAccepted: 'connectionAccepted',
  connectionAdded: 'connectionAdded',
  connectionRequestReceived: 'connectionRequestReceived',
} as const;
export type TSignalEventType = (typeof SIGNAL_EVENT_TYPE)[keyof typeof SIGNAL_EVENT_TYPE];

/** The filters a `postSearch` signal accepts: the content search filters other than sort, date and author. */
export type TSignalPostSearchFilter = Pick<
  TPostSearchFilter,
  | 'contentType'
  | 'postedBy'
  | 'mentioningMembers'
  | 'mentioningCompanies'
  | 'authorCompanies'
  | 'authorIndustries'
>;

interface TCreateSignalBaseParams {
  /** Your own identifier, up to 64 characters, returned with the signal and with every event it produces. */
  label?: string;
}

export interface TCreatePersonPostsSignalParams extends TCreateSignalBaseParams {
  type: typeof SIGNAL_TYPE.personPosts;
  personUrl: string;
}

export interface TCreateCompanyPostsSignalParams extends TCreateSignalBaseParams {
  type: typeof SIGNAL_TYPE.companyPosts;
  companyUrl: string;
}

export interface TCreatePostSearchSignalParams extends TCreateSignalBaseParams {
  type: typeof SIGNAL_TYPE.postSearch;
  /** A phrase, or an array of up to three phrases. */
  term: string | Array<string>;
  filter?: TSignalPostSearchFilter;
}

export interface TCreatePostEngagementSignalParams extends TCreateSignalBaseParams {
  type: typeof SIGNAL_TYPE.postEngagement;
  postUrl: string;
}

export interface TCreateMyPostsEngagementSignalParams extends TCreateSignalBaseParams {
  type: typeof SIGNAL_TYPE.postEngagement;
  myPosts: true;
}

export interface TCreateAccountSignalParams extends TCreateSignalBaseParams {
  type: typeof SIGNAL_TYPE.network | typeof SIGNAL_TYPE.profileViewers;
}

export type TCreateSignalParams =
  | TCreatePersonPostsSignalParams
  | TCreateCompanyPostsSignalParams
  | TCreatePostSearchSignalParams
  | TCreatePostEngagementSignalParams
  | TCreateMyPostsEngagementSignalParams
  | TCreateAccountSignalParams;

export interface TSignal {
  id: string;
  type: TSignalType;
  label: string | null;
  status: TSignalStatus;
  /** Why Linked API stopped the signal; `null` unless `status` is `stopped`. */
  stoppedReason: TSignalStoppedReason | null;
  createdAt: string;
  /** When the first check completed; `null` until then. */
  baselineAt: string | null;
  lastCheckedAt: string | null;
  /** The planned time of the next check, or `null` when the signal is not active. */
  nextCheckAt: string | null;
  personUrl?: string;
  companyUrl?: string;
  postUrl?: string;
  myPosts?: true;
  term?: string | Array<string>;
  filter?: TSignalPostSearchFilter;
}

export interface TGetSignalsParams {
  type?: TSignalType;
  status?: TSignalStatus;
}

export interface TGetSignalsResult {
  signals: Array<TSignal>;
}

export interface TSignalIdParams {
  signalId: string;
}

export interface TDeleteSignalResult {
  deleted: true;
}

export interface TSignalPollRequest {
  /** Return events detected after this timestamp. Pass the `detectedAt` of the newest event you have. */
  since?: string;
  signalId?: string;
  signalType?: TSignalType;
  eventType?: TSignalEventType;
}

interface TSignalEventBase {
  id: string;
  signalId: string;
  signalType: TSignalType;
  label: string | null;
  /** When Linked API recorded the event, not when it happened on LinkedIn. */
  detectedAt: string;
}

export interface TSignalPostEvent extends TSignalEventBase {
  type: typeof SIGNAL_EVENT_TYPE.postPublished | typeof SIGNAL_EVENT_TYPE.postFound;
  post: TSearchPostResult;
}

export interface TSignalCommentEvent extends TSignalEventBase {
  type: typeof SIGNAL_EVENT_TYPE.commentAdded;
  postUrl: string;
  comment: TPostComment & { parentCommentUrn: string | null };
}

export interface TSignalReactionEvent extends TSignalEventBase {
  type: typeof SIGNAL_EVENT_TYPE.reactionAdded;
  postUrl: string;
  reaction: {
    actor: TPostReactionActor;
    type: TReactionType;
  };
}

export interface TSignalProfileViewEvent extends TSignalEventBase {
  type: typeof SIGNAL_EVENT_TYPE.profileViewed;
  viewer: Extract<TProfileViewer, { viewerType: 'identified' }>;
}

export interface TSignalConnectionEvent extends TSignalEventBase {
  type:
    | typeof SIGNAL_EVENT_TYPE.connectionAccepted
    | typeof SIGNAL_EVENT_TYPE.connectionAdded
    | typeof SIGNAL_EVENT_TYPE.connectionRequestReceived;
  personUrn: string | null;
  personUrl: string;
}

export type TSignalEvent =
  | TSignalPostEvent
  | TSignalCommentEvent
  | TSignalReactionEvent
  | TSignalProfileViewEvent
  | TSignalConnectionEvent;

export interface TSignalPollResult {
  /** Newest first. */
  events: Array<TSignalEvent>;
}
