import { TBaseActionParams } from '../params';

import { TYearsOfExperience } from './person';
import type {
  TConnectionDegree,
  TNvConnectionDegreeFilter,
  TPersonViewerState,
} from './viewer-state';

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
    connectionDegrees?: TConnectionDegree[];
  };
  customSearchUrl?: string;
}

export interface TSearchPeopleResult {
  name: string;
  urn: string | null;
  publicUrl: string;
  headline: string;
  location: string;
  avatarUrl: string | null;
  viewerState: TPersonViewerState;
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
    yearsOfExperiences?: TYearsOfExperience[];
    connectionDegrees?: TNvConnectionDegreeFilter[];
  };
  customSearchUrl?: string;
}

export interface TNvSearchPeopleResult {
  name: string;
  urn: string | null;
  hashedUrl: string;
  position: string;
  location: string;
  avatarUrl: string | null;
  viewerState: TPersonViewerState;
}
