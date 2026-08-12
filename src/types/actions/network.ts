import { TBaseActionParams } from '../params';

export interface TSyncNetworkParams extends TBaseActionParams {}

export interface TNetworkPollRequest {
  since?: string;
  type?: TNetworkEventType;
}

export interface TNetworkEvent {
  id: string;
  type: TNetworkEventType;
  personUrn: string | null;
  personUrl: string;
  detectedAt: string;
}

export interface TNetworkPollResult {
  events: TNetworkEvent[];
}

export const NETWORK_EVENT_TYPE = {
  connectionAccepted: 'connectionAccepted',
  connectionAdded: 'connectionAdded',
  connectionRequestReceived: 'connectionRequestReceived',
} as const;
export type TNetworkEventType = (typeof NETWORK_EVENT_TYPE)[keyof typeof NETWORK_EVENT_TYPE];
