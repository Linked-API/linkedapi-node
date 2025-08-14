import { TYearsOfExperience } from "./person";
import { TBaseActionParams, TLimitParams } from "../params";

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
