import { TBaseActionParams } from "../params";

export interface TSearchCompanyParams extends TBaseActionParams {
  term?: string;
  limit?: number;
  filter?: {
    sizes?: TSearchCompanySize[];
    locations?: string[];
    industries?: string[];
  };
}

export type TSearchCompanySize =
  | "1-10"
  | "11-50"
  | "51-200"
  | "201-500"
  | "501-1000"
  | "1001-5000"
  | "5001-10000"
  | "10001+";

export interface TSearchCompanyResult {
  name: string;
  publicUrl: string;
  industry: string;
  location: string;
}

export interface TNvSearchCompanyParams extends TBaseActionParams {
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
}

export type TMinAnnualRevenue =
  | "0"
  | "0.5"
  | "1"
  | "2.5"
  | "5"
  | "10"
  | "20"
  | "50"
  | "100"
  | "500"
  | "1000";
export type TMaxAnnualRevenue =
  | "0.5"
  | "1"
  | "2.5"
  | "5"
  | "10"
  | "20"
  | "50"
  | "100"
  | "500"
  | "1000"
  | "1000+";

export interface TNvSearchCompanyResult {
  name: string;
  hashedUrl: string;
  industry: string;
  employeeCount: number;
}
