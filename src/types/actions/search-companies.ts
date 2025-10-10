import { TBaseActionParams } from '../params';

export interface TSearchCompaniesParams extends TBaseActionParams {
  term?: string;
  limit?: number;
  filter?: {
    sizes?: TSearchCompanySize[];
    locations?: string[];
    industries?: string[];
  };
  customSearchUrl?: string;
}

export const SEARCH_COMPANY_SIZE = {
  size1_10: '1-10',
  size11_50: '11-50',
  size51_200: '51-200',
  size201_500: '201-500',
  size501_1000: '501-1000',
  size1001_5000: '1001-5000',
  size5001_10000: '5001-10000',
  size10001Plus: '10001+',
} as const;
export type TSearchCompanySize = (typeof SEARCH_COMPANY_SIZE)[keyof typeof SEARCH_COMPANY_SIZE];

export interface TSearchCompanyResult {
  name: string;
  publicUrl: string;
  industry: string;
  location: string;
}

export interface TNvSearchCompaniesParams extends TBaseActionParams {
  term?: string;
  limit?: number;
  filter?: {
    sizes?: TSearchCompanySize[];
    locations?: string[];
    industries?: string[];
    annualRevenue?: {
      min: TMinAnnualRevenue;
      max: TMaxAnnualRevenue;
    };
  };
  customSearchUrl?: string;
}

export const MIN_ANNUAL_REVENUE = {
  revenue0: '0',
  revenue0_5: '0.5',
  revenue1: '1',
  revenue2_5: '2.5',
  revenue5: '5',
  revenue10: '10',
  revenue20: '20',
  revenue50: '50',
  revenue100: '100',
  revenue500: '500',
  revenue1000: '1000',
} as const;
export type TMinAnnualRevenue = (typeof MIN_ANNUAL_REVENUE)[keyof typeof MIN_ANNUAL_REVENUE];

export const MAX_ANNUAL_REVENUE = {
  revenue0_5: '0.5',
  revenue1: '1',
  revenue2_5: '2.5',
  revenue5: '5',
  revenue10: '10',
  revenue20: '20',
  revenue50: '50',
  revenue100: '100',
  revenue500: '500',
  revenue1000: '1000',
  revenue1000Plus: '1000+',
} as const;
export type TMaxAnnualRevenue = (typeof MAX_ANNUAL_REVENUE)[keyof typeof MAX_ANNUAL_REVENUE];

export interface TNvSearchCompanyResult {
  name: string;
  hashedUrl: string;
  industry: string;
  employeesCount: number;
}
