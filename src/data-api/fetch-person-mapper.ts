import type {
  TBaseFetchPersonParams,
  TFetchPersonResult,
} from "../types/actions/person";
import {
  ThenWorkflowMapper,
  type TActionConfig,
} from "../core/then-workflow-mapper.abstract";

const FETCH_PERSON_ACTIONS: TActionConfig[] = [
  {
    paramName: "retrieveExperience",
    actionType: "retrievePersonExperience",
  },
  {
    paramName: "retrieveEducation",
    actionType: "retrievePersonEducation",
  },
  {
    paramName: "retrieveSkills",
    actionType: "retrievePersonSkills",
  },
  {
    paramName: "retrieveLanguages",
    actionType: "retrievePersonLanguages",
  },
  {
    paramName: "retrievePosts",
    actionType: "retrievePersonPosts",
    configSource: "postsRetrievalConfig",
  },
  {
    paramName: "retrieveComments",
    actionType: "retrievePersonComments",
    configSource: "commentRetrievalConfig",
  },
  {
    paramName: "retrieveReactions",
    actionType: "retrievePersonReactions",
    configSource: "reactionRetrievalConfig",
  },
];

const RESPONSE_MAPPINGS = [
  {
    actionType: "retrievePersonExperience",
    targetProperty: "experiences",
  },
  {
    actionType: "retrievePersonEducation",
    targetProperty: "education",
  },
  {
    actionType: "retrievePersonSkills",
    targetProperty: "skills",
  },
  {
    actionType: "retrievePersonLanguages",
    targetProperty: "languages",
  },
  {
    actionType: "retrievePersonPosts",
    targetProperty: "posts",
  },
  {
    actionType: "retrievePersonComments",
    targetProperty: "comments",
  },
  {
    actionType: "retrievePersonReactions",
    targetProperty: "reactions",
  },
];

export class DtFetchPersonMapper<
  TParams extends TBaseFetchPersonParams,
> extends ThenWorkflowMapper<TParams, TFetchPersonResult<TParams>> {
  constructor() {
    super({
      actionConfigs: FETCH_PERSON_ACTIONS,
      responseMappings: RESPONSE_MAPPINGS,
      baseActionType: "openPersonPage",
      defaultParams: {
        basicInfo: true,
      },
    });
  }
}
