import { TBaseActionParams } from '../params';

export const JOB_DATE_POSTED = {
  anyTime: 'anyTime',
  past24Hours: 'past24Hours',
  pastWeek: 'pastWeek',
  pastMonth: 'pastMonth',
} as const;
export type TJobDatePosted = (typeof JOB_DATE_POSTED)[keyof typeof JOB_DATE_POSTED];

export const JOB_EXPERIENCE_LEVEL = {
  internship: 'internship',
  entryLevel: 'entryLevel',
  associate: 'associate',
  midSeniorLevel: 'midSeniorLevel',
  director: 'director',
  executive: 'executive',
} as const;
export type TJobExperienceLevel = (typeof JOB_EXPERIENCE_LEVEL)[keyof typeof JOB_EXPERIENCE_LEVEL];

export const JOB_EMPLOYMENT_TYPE = {
  fullTime: 'fullTime',
  partTime: 'partTime',
  contract: 'contract',
  temporary: 'temporary',
  volunteer: 'volunteer',
  internship: 'internship',
  other: 'other',
} as const;
export type TJobEmploymentType = (typeof JOB_EMPLOYMENT_TYPE)[keyof typeof JOB_EMPLOYMENT_TYPE];

export const JOB_WORKPLACE_TYPE = {
  onSite: 'onSite',
  remote: 'remote',
  hybrid: 'hybrid',
} as const;
export type TJobWorkplaceType = (typeof JOB_WORKPLACE_TYPE)[keyof typeof JOB_WORKPLACE_TYPE];

export const JOB_SALARY_PERIOD = {
  yearly: 'yearly',
  monthly: 'monthly',
  hourly: 'hourly',
} as const;
export type TJobSalaryPeriod = (typeof JOB_SALARY_PERIOD)[keyof typeof JOB_SALARY_PERIOD];

export const JOB_CURRENCY = {
  usd: 'usd',
  eur: 'eur',
  gbp: 'gbp',
  inr: 'inr',
  cad: 'cad',
  aud: 'aud',
  nzd: 'nzd',
  hkd: 'hkd',
  sgd: 'sgd',
  jpy: 'jpy',
  cny: 'cny',
  chf: 'chf',
  sek: 'sek',
  nok: 'nok',
  dkk: 'dkk',
  pln: 'pln',
  czk: 'czk',
  huf: 'huf',
  ron: 'ron',
  brl: 'brl',
  mxn: 'mxn',
  ars: 'ars',
  zar: 'zar',
  aed: 'aed',
  sar: 'sar',
  ils: 'ils',
  try: 'try',
  rub: 'rub',
  uah: 'uah',
  krw: 'krw',
  thb: 'thb',
  idr: 'idr',
  myr: 'myr',
  php: 'php',
  vnd: 'vnd',
  ngn: 'ngn',
  twd: 'twd',
} as const;
export type TJobCurrency = (typeof JOB_CURRENCY)[keyof typeof JOB_CURRENCY];

export interface TJobSalary {
  currency: TJobCurrency | null;
  minAmount: number | null;
  maxAmount: number | null;
  period: TJobSalaryPeriod | null;
}

export interface TJobFilter {
  location?: string;
  datePosted?: TJobDatePosted;
  experienceLevels?: TJobExperienceLevel[];
  employmentTypes?: TJobEmploymentType[];
  workplaceTypes?: TJobWorkplaceType[];
  companies?: string[];
  industries?: string[];
  jobFunctions?: string[];
  easyApply?: boolean;
  hasVerifications?: boolean;
  under10Applicants?: boolean;
  inYourNetwork?: boolean;
  fairChanceEmployer?: boolean;
}

export interface TSearchJobsParams extends TBaseActionParams {
  term?: string;
  limit?: number;
  filter?: TJobFilter;
  customSearchUrl?: string;
}

export interface TSearchJobResult {
  jobId: string | null;
  jobUrl: string | null;
  title: string;
  companyName: string | null;
  location: string | null;
  workplaceType: string | null;
  salary: TJobSalary | null;
  easyApply: boolean;
  isPromoted: boolean;
}

export interface TBaseFetchJobParams extends TBaseActionParams {
  jobUrl: string;
}

export type TFetchJobParams = TBaseFetchJobParams;

export interface TJob {
  jobId: string;
  jobUrl: string;
  title: string;
  companyName: string | null;
  companyUrl: string | null;
  location: string | null;
  postedDate: string | null;
  applicantsCount: number | null;
  workplaceType: string | null;
  employmentType: string | null;
  salary: TJobSalary | null;
  description: string | null;
  applyUrl: string | null;
  easyApply: boolean;
}

export type TFetchJobResult = TJob;
