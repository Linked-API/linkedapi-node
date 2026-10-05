import { TBaseActionParams, TLimitParams, TLimitSinceParams } from '../params';

import { TYearsOfExperience } from './person';
import type { TPost } from './post';
import type {
  TConnectionDegree,
  TNvConnectionDegreeFilter,
  TPersonViewerState,
} from './viewer-state';

export interface TCompany {
  name: string;
  urn: string | null;
  publicUrl: string;
  description: string;
  location: string;
  headquarters: string;
  industry: string;
  specialties: string;
  website: string;
  employeesCount: number;
  yearFounded?: number;
  ventureFinancing: boolean;
  jobsCount: number;
  logoUrl: string | null;
  employees?: ReadonlyArray<TStCompanyEmployee>;
  dms?: ReadonlyArray<TStCompanyDm>;
  posts?: ReadonlyArray<TPost>;
}

export interface TBaseFetchCompanyParams extends TBaseActionParams {
  companyUrl: string;
  retrieveEmployees?: boolean;
  retrieveDMs?: boolean;
  retrievePosts?: boolean;
}

export interface TBaseFetchCompanyParamsWide extends TBaseFetchCompanyParams {
  retrieveEmployees: true;
  retrieveDMs: true;
  retrievePosts: true;
}

export type TFetchCompanyParams<T extends TBaseFetchCompanyParams = TBaseFetchCompanyParams> = T & {
  employeesRetrievalConfig?: T['retrieveEmployees'] extends true
    ? TStCompanyEmployeesRetrievalConfig | undefined
    : never;
  dmsRetrievalConfig?: T['retrieveDMs'] extends true ? TLimitParams | undefined : never;
  postsRetrievalConfig?: T['retrievePosts'] extends true ? TLimitSinceParams | undefined : never;
};

export type TFetchCompanyResult = TCompany;

export interface TStCompanyEmployee {
  name: string;
  urn: string | null;
  publicUrl: string;
  headline: string;
  location: string;
  avatarUrl: string | null;
  viewerState: TPersonViewerState;
}

export interface TStCompanyDm {
  name: string;
  urn: string | null;
  publicUrl: string;
  headline: string;
  location: string;
  avatarUrl: string | null;
  countryCode: string;
  viewerState: TPersonViewerState;
}

export interface TStCompanyEmployeesRetrievalConfig extends TLimitParams {
  filter?: {
    firstName?: string;
    lastName?: string;
    position?: string;
    locations?: string[];
    industries?: string[];
    schools?: string[];
    connectionDegrees?: TConnectionDegree[];
  };
}

export interface TNvCompany {
  name: string;
  urn: string | null;
  publicUrl: string;
  description: string;
  location: string;
  headquarters: string;
  industry: string;
  website: string;
  employeesCount: number;
  yearFounded?: number;
  logoUrl: string | null;
  employees?: ReadonlyArray<TNvCompanyEmployee>;
  dms?: ReadonlyArray<TNvCompanyDm>;
}

export interface TNvCompanyEmployee {
  name: string;
  urn: string | null;
  hashedUrl: string;
  position: string;
  location: string;
  avatarUrl: string | null;
  viewerState: TPersonViewerState;
}

export interface TNvCompanyDm {
  name: string;
  urn: string | null;
  hashedUrl: string;
  position: string;
  location: string;
  avatarUrl: string | null;
  countryCode: string;
  viewerState: TPersonViewerState;
}

export interface TNvBaseFetchCompanyParams extends TBaseActionParams {
  companyHashedUrl: string;
  retrieveEmployees?: boolean;
  retrieveDMs?: boolean;
}

export interface TNvBaseFetchCompanyParamsWide extends TNvBaseFetchCompanyParams {
  retrieveEmployees: true;
  retrieveDMs: true;
}

export type TNvFetchCompanyParams<T extends TNvBaseFetchCompanyParams = TNvBaseFetchCompanyParams> =
  T & {
    employeesRetrievalConfig?: T['retrieveEmployees'] extends true
      ? TNvCompanyEmployeeRetrievalConfig | undefined
      : never;
    dmsRetrievalConfig?: T['retrieveDMs'] extends true ? TLimitParams | undefined : never;
  };

export type TNvFetchCompanyResult = TNvCompany;

export interface TNvCompanyEmployeeRetrievalConfig extends TLimitParams {
  filter?: {
    firstName?: string;
    lastName?: string;
    positions?: string[];
    locations?: string[];
    industries?: string[];
    schools?: string[];
    yearsOfExperiences?: TYearsOfExperience[];
    connectionDegrees?: TNvConnectionDegreeFilter[];
  };
}
