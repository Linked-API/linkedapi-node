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
  retrieveDms?: boolean;
}

export interface TDtBaseFetchCompanyParams extends TBaseActionParams {
  companyUrl: string;
  retrieveEmployees?: boolean;
  retrieveDms?: boolean;
}

export type TNvFetchCompanyParams<
  T extends TNvBaseFetchCompanyParams = TNvBaseFetchCompanyParams,
> = T & {
  employeeRetrievalConfig?: T["retrieveEmployees"] extends true
    ? TNvCompanyEmployeeRetrievalConfig | undefined
    : never;
  dmRetrievalConfig?: T["retrieveDms"] extends true
    ? TLimitParams | undefined
    : never;
};

export type TDtFetchCompanyParams<
  T extends TDtBaseFetchCompanyParams = TDtBaseFetchCompanyParams,
> = T & {
  employeeRetrievalConfig?: T["retrieveEmployees"] extends true
    ? TNvCompanyEmployeeRetrievalConfig | undefined
    : never;
  dmRetrievalConfig?: T["retrieveDms"] extends true
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
      ? { employees: ReadonlyArray<TNvCompanyEmployee> }
      : Record<string, never>) &
    (TParams["retrieveDms"] extends true
      ? { dms: ReadonlyArray<TNvCompanyDm> }
      : Record<string, never>);

export type TDtFetchCompanyResult<TParams extends TDtBaseFetchCompanyParams> =
  TNvBaseCompany &
    (TParams["retrieveEmployees"] extends true
      ? { employees: ReadonlyArray<TNvCompanyEmployee> }
      : Record<string, never>) &
    (TParams["retrieveDms"] extends true
      ? { dms: ReadonlyArray<TNvCompanyDm> }
      : Record<string, never>);

export interface TNvCompanyEmployeeRetrievalConfig extends TLimitParams {
  filter?: {
    firstName?: string;
    lastName?: string;
    positions?: string[];
    locations?: string[];
    industries?: string[];
    schools?: string[];
    yearsOfExperiences?: TNvYearsOfExperience[];
  };
}

export type TNvYearsOfExperience =
  | "lessThanOne"
  | "oneToTwo"
  | "threeToFive"
  | "sixToTen"
  | "moreThanTen";
