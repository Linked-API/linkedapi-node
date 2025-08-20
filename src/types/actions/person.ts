import type { TBaseActionParams, TLimitSinceParams } from "../params";
import type { TComment, TPost, TReaction } from "./post";

export interface TPerson {
  name: string;
  publicUrl: string;
  hashedUrl: string;
  headline: string;
  location: string;
  countryCode: string;
  position: string;
  companyName: string;
  companyHashedUrl: string;
  experiences?: ReadonlyArray<TPersonExperience>;
  education?: ReadonlyArray<TPersonEducation>;
  skills?: ReadonlyArray<TPersonSkill>;
  languages?: ReadonlyArray<TPersonLanguage>;
  posts?: ReadonlyArray<TPost>;
  comments?: ReadonlyArray<TComment>;
  reactions?: ReadonlyArray<TReaction>;
}

export interface TBaseFetchPersonParams extends TBaseActionParams {
  personUrl: string;
  retrieveExperience?: boolean;
  retrieveEducation?: boolean;
  retrieveSkills?: boolean;
  retrieveLanguages?: boolean;
  retrievePosts?: boolean;
  retrieveComments?: boolean;
  retrieveReactions?: boolean;
}

export interface TBaseFetchPersonParamsWide extends TBaseFetchPersonParams {
  retrieveExperience: true;
  retrieveEducation: true;
  retrieveSkills: true;
  retrieveLanguages: true;
  retrievePosts: true;
  retrieveComments: true;
  retrieveReactions: true;
}

export type TFetchPersonParams<
  T extends TBaseFetchPersonParams = TBaseFetchPersonParams,
> = T & {
  postsRetrievalConfig?: T["retrievePosts"] extends true
    ? TLimitSinceParams | undefined
    : never;
  commentsRetrievalConfig?: T["retrieveComments"] extends true
    ? TLimitSinceParams | undefined
    : never;
  reactionsRetrievalConfig?: T["retrieveReactions"] extends true
    ? TLimitSinceParams | undefined
    : never;
};

type TBasePerson = Pick<
  TPerson,
  | "name"
  | "publicUrl"
  | "hashedUrl"
  | "headline"
  | "location"
  | "countryCode"
  | "position"
  | "companyName"
  | "companyHashedUrl"
>;

export type TFetchPersonResult<TParams extends TBaseFetchPersonParams> =
  TBasePerson &
    (TParams["retrieveExperience"] extends true
      ? { experiences: ReadonlyArray<TPersonExperience> | undefined }
      : Record<string, never>) &
    (TParams["retrieveEducation"] extends true
      ? { education: ReadonlyArray<TPersonEducation> | undefined }
      : Record<string, never>) &
    (TParams["retrieveSkills"] extends true
      ? { skills: ReadonlyArray<TPersonSkill> | undefined }
      : Record<string, never>) &
    (TParams["retrieveLanguages"] extends true
      ? { languages: ReadonlyArray<TPersonLanguage> | undefined }
      : Record<string, never>) &
    (TParams["retrievePosts"] extends true
      ? { posts: ReadonlyArray<TPost> | undefined }
      : Record<string, never>) &
    (TParams["retrieveComments"] extends true
      ? { comments: ReadonlyArray<TComment> | undefined }
      : Record<string, never>) &
    (TParams["retrieveReactions"] extends true
      ? { reactions: ReadonlyArray<TReaction> | undefined }
      : Record<string, never>);

export type TFetchPersonResultWide = TBasePerson & {
  experiences?: ReadonlyArray<TPersonExperience>;
  education?: ReadonlyArray<TPersonEducation>;
  skills?: ReadonlyArray<TPersonSkill>;
  languages?: ReadonlyArray<TPersonLanguage>;
  posts?: ReadonlyArray<TPost>;
  comments?: ReadonlyArray<TComment>;
  reactions?: ReadonlyArray<TReaction>;
};

export interface TPersonExperience {
  position: string;
  companyName: string;
  companyHashedUrl: string;
  employmentType: TEmploymentType;
  locationType: TLocationType;
  description: string;
  duration: number;
  startTime: string;
  endTime: string | null;
  location: string;
}

export const EMPLOYMENT_TYPE = {
  fullTime: "fullTime",
  partTime: "partTime",
  selfEmployed: "selfEmployed",
  freelance: "freelance",
  contract: "contract",
  internship: "internship",
  apprenticeship: "apprenticeship",
  seasonal: "seasonal",
} as const;
export type TEmploymentType =
  (typeof EMPLOYMENT_TYPE)[keyof typeof EMPLOYMENT_TYPE];

export const LOCATION_TYPE = {
  onSite: "onSite",
  remote: "remote",
  hybrid: "hybrid",
} as const;
export type TLocationType = (typeof LOCATION_TYPE)[keyof typeof LOCATION_TYPE];

export interface TPersonEducation {
  schoolName: string;
  schoolHashedUrl: string;
  details: string;
}

export interface TPersonSkill {
  name: string;
}

export interface TPersonLanguage {
  name: string;
  proficiency: TLanguageProficiency;
}

export const LANGUAGE_PROFICIENCY = {
  elementary: "elementary",
  limitedWorking: "limitedWorking",
  professionalWorking: "professionalWorking",
  fullProfessional: "fullProfessional",
  nativeOrBilingual: "nativeOrBilingual",
} as const;
export type TLanguageProficiency =
  (typeof LANGUAGE_PROFICIENCY)[keyof typeof LANGUAGE_PROFICIENCY];

export const YEARS_OF_EXPERIENCE = {
  lessThanOne: "lessThanOne",
  oneToTwo: "oneToTwo",
  threeToFive: "threeToFive",
  sixToTen: "sixToTen",
  moreThanTen: "moreThanTen",
} as const;
export type TYearsOfExperience =
  (typeof YEARS_OF_EXPERIENCE)[keyof typeof YEARS_OF_EXPERIENCE];
