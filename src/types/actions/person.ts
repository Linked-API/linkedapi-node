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

export type TFetchPersonParams<
  T extends TBaseFetchPersonParams = TBaseFetchPersonParams,
> = T & {
  postsRetrievalConfig?: T["retrievePosts"] extends true
    ? TLimitSinceParams | undefined
    : never;
  commentRetrievalConfig?: T["retrieveComments"] extends true
    ? TLimitSinceParams | undefined
    : never;
  reactionRetrievalConfig?: T["retrieveReactions"] extends true
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
      ? { experiences: ReadonlyArray<TPersonExperience> }
      : Record<string, never>) &
    (TParams["retrieveEducation"] extends true
      ? { education: ReadonlyArray<TPersonEducation> }
      : Record<string, never>) &
    (TParams["retrieveSkills"] extends true
      ? { skills: ReadonlyArray<TPersonSkill> }
      : Record<string, never>) &
    (TParams["retrieveLanguages"] extends true
      ? { languages: ReadonlyArray<TPersonLanguage> }
      : Record<string, never>) &
    (TParams["retrievePosts"] extends true
      ? { posts: ReadonlyArray<TPost> }
      : Record<string, never>) &
    (TParams["retrieveComments"] extends true
      ? { comments: ReadonlyArray<TComment> }
      : Record<string, never>) &
    (TParams["retrieveReactions"] extends true
      ? { reactions: ReadonlyArray<TReaction> }
      : Record<string, never>);

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

export type TEmploymentType =
  | "fullTime"
  | "partTime"
  | "selfEmployed"
  | "freelance"
  | "contract"
  | "internship"
  | "apprenticeship"
  | "seasonal";
export type TLocationType = "onSite" | "remote" | "hybrid";

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

export type TLanguageProficiency =
  | "elementary"
  | "limitedWorking"
  | "professionalWorking"
  | "fullProfessional"
  | "nativeOrBilingual";
