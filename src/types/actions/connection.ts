import { TBaseActionParams, TLimitParams } from "../params";

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

export type TConnectionStatus = "connected" | "pending" | "notConnected";

export interface TWithdrawConnectionRequestParams extends TBaseActionParams {
  personUrl: string;
  unfollow?: boolean;
}

export interface TRetrievePendingRequestsResult {
  name: string;
  publicUrl: string;
  headline: string;
}

export interface TRetrieveConnectionsParams extends TLimitParams {
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
  publicUrl: string;
  headline: string;
  location: string;
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
  publicUrl: string;
  hashedUrl: string;
  headline: string;
  location: string;
  countryCode: string;
  position: string;
  companyName: string;
  companyHashedUrl: string;
}
