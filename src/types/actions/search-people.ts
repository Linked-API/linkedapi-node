import { TBaseActionParams } from "../params";

export interface TSearchPeopleParams extends TBaseActionParams {
  term?: string;
  limit?: number;
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

export interface TSearchPeopleResult {
  name: string;
  publicUrl: string;
  headline: string;
  location: string;
}

export interface TNvSearchPeopleParams extends TBaseActionParams {
  term?: string;
  limit?: number;
  filter?: {
    firstName?: string;
    lastName?: string;
    position?: string;
    locations?: string[];
    industries?: string[];
    currentCompanies?: string[];
    previousCompanies?: string[];
    schools?: string[];
    yearsOfExperience?: TSearchPeopleYearsOfExperience[];
  };
}

export type TSearchPeopleYearsOfExperience =
  | "0-1"
  | "1-2"
  | "3-5"
  | "6-10"
  | "10+";

export interface TNvSearchPeopleResult {
  name: string;
  hashedUrl: string;
  position: string;
  location: string;
}
