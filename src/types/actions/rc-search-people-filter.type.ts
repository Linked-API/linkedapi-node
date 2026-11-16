import type { RC_FILTER_OPTIONS } from './rc-filter-options';

export interface TRcSearchPeopleFilter {
  jobTitles?: ReadonlyArray<string>;
  jobTitlesScope?: 'currentOrPast' | 'current' | 'pastNotCurrent' | 'past';
  locations?: ReadonlyArray<string>;
  locationsScope?: 'current' | 'currentOrOpenToRelocate' | 'openToRelocateOnly';
  postalCode?: {
    code: string;
    radiusMiles?: (typeof RC_FILTER_OPTIONS.postalCodeRadiusMiles)[number];
  };
  skills?: ReadonlyArray<string>;
  hasPassedSkillAssessment?: boolean;
  companies?: ReadonlyArray<string>;
  companiesScope?: 'currentOrPast' | 'current' | 'pastNotCurrent' | 'past';
  currentCompanies?: ReadonlyArray<string>;
  pastCompanies?: ReadonlyArray<string>;
  companySizes?: ReadonlyArray<(typeof RC_FILTER_OPTIONS.companySizes)[number]>;
  schools?: ReadonlyArray<string>;
  graduationYears?: { from?: number; to?: number };
  industries?: ReadonlyArray<string>;
  jobFunctions?: ReadonlyArray<(typeof RC_FILTER_OPTIONS.jobFunctions)[number]>;
  seniority?: ReadonlyArray<(typeof RC_FILTER_OPTIONS.seniority)[number]>;
  yearsOfExperience?: { from?: number; to?: number };
  firstNames?: ReadonlyArray<string>;
  lastNames?: ReadonlyArray<string>;
  /** LinkedIn language codes such as en, es, in and _o, rather than language names. */
  profileLanguages?: ReadonlyArray<string>;
  recentlyJoined?: ReadonlyArray<(typeof RC_FILTER_OPTIONS.recentlyJoined)[number]>;
  networkRelationships?: ReadonlyArray<(typeof RC_FILTER_OPTIONS.networkRelationships)[number]>;
  isMilitaryVeteran?: boolean;
  groups?: ReadonlyArray<string>;
  recruitingActivity?: {
    type: (typeof RC_FILTER_OPTIONS.recruitingActivityType)[number];
    period?: (typeof RC_FILTER_OPTIONS.recruitingActivityPeriod)[number];
  };
  projects?: ReadonlyArray<string>;
  notes?: ReadonlyArray<string>;
  hidePreviouslyViewed?: boolean;
}
