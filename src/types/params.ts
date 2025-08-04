export interface TBaseActionParams {}

export interface TLimitParams {
  limit?: number;
}

export interface TLimitSinceParams extends TLimitParams {
  since?: string;
}
