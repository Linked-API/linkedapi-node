import type { TPost } from "./post";
import { TBaseActionParams, TLimitParams, TLimitSinceParams } from "../params";

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
