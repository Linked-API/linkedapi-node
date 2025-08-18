import type { TPost } from "./post";
import { TBaseActionParams, TLimitParams, TLimitSinceParams } from "../params";
import { TYearsOfExperience } from "./person";

export interface TCompany {
  name: string;
  publicUrl: string;
  description: string;
  location: string;
  headquarters: string;
  industry: string;
  specialties: string;
  website: string;
  employeeCount: number;
  yearFounded?: number;
  ventureFinancing: boolean;
  jobsCount: number;
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

export type TFetchCompanyParams<
  T extends TBaseFetchCompanyParams = TBaseFetchCompanyParams,
> = T & {
  employeesRetrievalConfig?: T["retrieveEmployees"] extends true
    ? TStCompanyEmployeesRetrievalConfig | undefined
    : never;
  dmsRetrievalConfig?: T["retrieveDMs"] extends true
    ? TLimitParams | undefined
    : never;
  postsRetrievalConfig?: T["retrievePosts"] extends true
    ? TLimitSinceParams | undefined
    : never;
};

type TBaseCompany = Pick<
  TCompany,
  | "name"
  | "publicUrl"
  | "description"
  | "location"
  | "headquarters"
  | "industry"
  | "specialties"
  | "website"
  | "employeeCount"
  | "yearFounded"
  | "ventureFinancing"
  | "jobsCount"
>;

export type TFetchCompanyResult<TParams extends TBaseFetchCompanyParams> =
  TBaseCompany &
    (TParams["retrieveEmployees"] extends true
      ? { employees: ReadonlyArray<TStCompanyEmployee> }
      : Record<string, never>) &
    (TParams["retrieveDMs"] extends true
      ? { dms: ReadonlyArray<TStCompanyDm> }
      : Record<string, never>) &
    (TParams["retrievePosts"] extends true
      ? { posts: ReadonlyArray<TPost> }
      : Record<string, never>);

export type TFetchCompanyResultWide = TBaseCompany & {
  employees?: ReadonlyArray<TStCompanyEmployee>;
  dms?: ReadonlyArray<TStCompanyDm>;
  posts?: ReadonlyArray<TPost>;
};

export interface TStCompanyEmployee {
  name: string;
  publicUrl: string;
  headline: string;
  location: string;
}

export interface TStCompanyDm {
  name: string;
  publicUrl: string;
  headline: string;
  location: string;
  countryCode: string;
}

export interface TStCompanyEmployeesRetrievalConfig extends TLimitParams {
  filter?: {
    firstName?: string;
    lastName?: string;
    position?: string;
    locations?: string[];
    industries?: string[];
    schools?: string[];
  };
}

export interface TNvCompany {
  name: string;
  publicUrl: string;
  description: string;
  location: string;
  headquarters: string;
  industry: string;
  website: string;
  employeeCount: number;
  yearFounded?: number;
  employees?: ReadonlyArray<TNvCompanyEmployee>;
  dms?: ReadonlyArray<TNvCompanyDm>;
}

export interface TNvCompanyEmployee {
  name: string;
  hashedUrl: string;
  position: string;
  location: string;
}

export interface TNvCompanyDm {
  name: string;
  hashedUrl: string;
  position: string;
  location: string;
  countryCode: string;
}

export interface TNvBaseFetchCompanyParams extends TBaseActionParams {
  companyHashedUrl: string;
  retrieveEmployees?: boolean;
  retrieveDMs?: boolean;
}

export interface TNvBaseFetchCompanyParamsWide
  extends TNvBaseFetchCompanyParams {
  retrieveEmployees: true;
  retrieveDMs: true;
}

export type TNvFetchCompanyParams<
  T extends TNvBaseFetchCompanyParams = TNvBaseFetchCompanyParams,
> = T & {
  employeesRetrievalConfig?: T["retrieveEmployees"] extends true
    ? TNvCompanyEmployeeRetrievalConfig | undefined
    : never;
  dmsRetrievalConfig?: T["retrieveDMs"] extends true
    ? TLimitParams | undefined
    : never;
};

type TNvBaseCompany = Pick<
  TNvCompany,
  | "name"
  | "publicUrl"
  | "description"
  | "location"
  | "headquarters"
  | "industry"
  | "website"
  | "employeeCount"
  | "yearFounded"
>;

export type TNvFetchCompanyResult<TParams extends TNvBaseFetchCompanyParams> =
  TNvBaseCompany &
    (TParams["retrieveEmployees"] extends true
      ? { employees: ReadonlyArray<TNvCompanyEmployee> | undefined }
      : Record<string, never>) &
    (TParams["retrieveDMs"] extends true
      ? { dms: ReadonlyArray<TNvCompanyDm> | undefined }
      : Record<string, never>);

export type TNvFetchCompanyResultWide = TNvBaseCompany & {
  employees?: ReadonlyArray<TNvCompanyEmployee>;
  dms?: ReadonlyArray<TNvCompanyDm>;
};

export interface TNvCompanyEmployeeRetrievalConfig extends TLimitParams {
  filter?: {
    firstName?: string;
    lastName?: string;
    positions?: string[];
    locations?: string[];
    industries?: string[];
    schools?: string[];
    yearsOfExperiences?: TYearsOfExperience[];
  };
}
