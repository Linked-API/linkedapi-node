import { TBaseActionParams } from '../params';

import { TYearsOfExperience } from './person';

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
  customSearchUrl?: string;
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
    yearsOfExperience?: TYearsOfExperience[];
  };
  customSearchUrl?: string;
}

export interface TNvSearchPeopleResult {
  name: string;
  hashedUrl: string;
  position: string;
  location: string;
}
