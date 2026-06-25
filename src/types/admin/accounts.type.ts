export interface TAdminAccount {
  id: string;
  name: string;
  url: string;
  avatarUrl: string | null;
  headline: string | null;
  countryCode: string;
  identificationToken: string;
  status: 'active' | 'frozen' | 'reconnection_required';
  connectedAt: string;
  reconnectionSessionId?: string;
  reconnectionLink?: string;
}

export interface TPendingConnectionSession {
  sessionId: string;
  status: string;
}

export interface TAccountsResult {
  accounts: Array<TAdminAccount>;
  pendingConnectionSessions: Array<TPendingConnectionSession>;
}

export interface TDisconnectParams {
  accountId: string;
}

export interface TReparseAccountInfoParams {
  accountId: string;
}

export interface TReparseAccountInfoResult {
  workflowId: string;
}

export interface TRegenerateTokenParams {
  accountId: string;
}

export interface TRegenerateTokenResult {
  token: string;
}

export interface TCreateConnectionSessionResult {
  sessionId: string;
  connectionLink: string;
}

export interface TCreateReconnectionSessionParams {
  accountId: string;
}

export interface TCreateReconnectionSessionResult {
  reconnectionSessionId: string;
  reconnectionLink: string;
}

export interface TGetConnectionSessionParams {
  sessionId: string;
}

export interface TConnectionSessionResult {
  session: {
    sessionId: string;
    status:
      | 'pending'
      | 'preparing'
      | 'serving'
      | 'streaming'
      | 'success'
      | 'expired'
      | 'error'
      | 'cancelled';
    type: string;
  };
}

export interface TCancelConnectionSessionParams {
  sessionId: string;
}
