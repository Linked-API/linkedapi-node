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
    actionType: "st.retrievePersonExperience",
  },
  {
    paramName: "retrieveEducation",
    actionType: "st.retrievePersonEducation",
  },
  {
    paramName: "retrieveSkills",
    actionType: "st.retrievePersonSkills",
  },
  {
    paramName: "retrieveLanguages",
    actionType: "st.retrievePersonLanguages",
  },
  {
    paramName: "retrievePosts",
    actionType: "st.retrievePersonPosts",
    configSource: "postsRetrievalConfig",
  },
  {
    paramName: "retrieveComments",
    actionType: "st.retrievePersonComments",
    configSource: "commentRetrievalConfig",
  },
  {
    paramName: "retrieveReactions",
    actionType: "st.retrievePersonReactions",
    configSource: "reactionRetrievalConfig",
  },
];

const RESPONSE_MAPPINGS = [
  {
    actionType: "st.retrievePersonExperience",
    targetProperty: "experiences",
  },
  {
    actionType: "st.retrievePersonEducation",
    targetProperty: "education",
  },
  {
    actionType: "st.retrievePersonSkills",
    targetProperty: "skills",
  },
  {
    actionType: "st.retrievePersonLanguages",
    targetProperty: "languages",
  },
  {
    actionType: "st.retrievePersonPosts",
    targetProperty: "posts",
  },
  {
    actionType: "st.retrievePersonComments",
    targetProperty: "comments",
  },
  {
    actionType: "st.retrievePersonReactions",
    targetProperty: "reactions",
  },
];

export class AcFetchPersonMapper<
  TParams extends TBaseFetchPersonParams,
> extends ThenWorkflowMapper<TParams, TFetchPersonResult<TParams>> {
  constructor() {
    super({
      actionConfigs: FETCH_PERSON_ACTIONS,
      responseMappings: RESPONSE_MAPPINGS,
      baseActionType: "st.openPersonPage",
      defaultParams: {
        basicInfo: true,
      },
    });
  }
}
