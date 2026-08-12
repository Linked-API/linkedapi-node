import { TBaseActionParams, TLimitParams } from '../params';

// Base connection interfaces
export interface TConnectionPerson {
  name: string;
  publicUrl: string;
  headline: string;
  location: string;
  profileImageUrl?: string;
}

export interface TSendConnectionRequestParams extends TBaseActionParams {
  personUrl: string;
  note?: string;
  email?: string;
}

export interface TCheckConnectionStatusParams extends TBaseActionParams {
  personUrl: string;
}

export interface TCheckConnectionStatusResult {
  connectionStatus: TConnectionStatus;
}

export const CONNECTION_STATUS = {
  connected: 'connected',
  pending: 'pending',
  incoming: 'incoming',
  notConnected: 'notConnected',
} as const;
export type TConnectionStatus = (typeof CONNECTION_STATUS)[keyof typeof CONNECTION_STATUS];

export interface TWithdrawConnectionRequestParams extends TBaseActionParams {
  personUrl: string;
  unfollow?: boolean;
}

export interface TRetrievePendingRequestsResult {
  name: string;
  urn: string | null;
  publicUrl: string;
  headline: string;
  sentTime: string;
}

export interface TRetrieveConnectionsParams extends TLimitParams {
  since?: string;
  filter?: {
    firstName?: string;
    lastName?: string;
    position?: string;
    locations?: string[];
    industries?: string[];
    currentCompanies?: string[];
    previousCompanies?: string[];
    schools?: string[];
  };
}

export interface TRetrieveConnectionsResult {
  name: string;
  urn: string | null;
  publicUrl: string;
  headline: string;
  location?: string;
  connectedAt?: string;
  avatarUrl?: string | null;
}

// Remove Connection
export interface TRemoveConnectionParams extends TBaseActionParams {
  personUrl: string;
}

export interface TNvOpenPersonPageParams extends TBaseActionParams {
  personHashedUrl: string;
}

export interface TNvOpenPersonPageResult {
  name: string;
  urn: string | null;
  publicUrl: string;
  hashedUrl: string;
  headline: string;
  location: string;
  countryCode: string;
  position: string;
  companyName: string;
  companyUrn: string | null;
  companyHashedUrl: string;
  avatarUrl: string | null;
}
