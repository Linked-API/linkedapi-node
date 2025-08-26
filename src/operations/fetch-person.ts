import { Operation, TOperationName } from '../core';
import { TActionConfig, ThenWorkflowMapper } from '../mappers/then-workflow-mapper.abstract';
import { TBaseFetchPersonParams, TFetchPersonParams, TFetchPersonResult } from '../types';

export class FetchPerson extends Operation<TBaseFetchPersonParams, TFetchPersonResult> {
  public override readonly operationName: TOperationName = 'fetchPerson';
  protected override readonly mapper = new FetchPersonMapper();

  public override async execute<TParams extends TBaseFetchPersonParams>(
    params: TFetchPersonParams<TParams>,
  ): Promise<string> {
    return super.execute(params);
  }
}

const FETCH_PERSON_ACTIONS: TActionConfig[] = [
  {
    paramName: 'retrieveExperience',
    actionType: 'st.retrievePersonExperience',
  },
  {
    paramName: 'retrieveEducation',
    actionType: 'st.retrievePersonEducation',
  },
  {
    paramName: 'retrieveSkills',
    actionType: 'st.retrievePersonSkills',
  },
  {
    paramName: 'retrieveLanguages',
    actionType: 'st.retrievePersonLanguages',
  },
  {
    paramName: 'retrievePosts',
    actionType: 'st.retrievePersonPosts',
    configSource: 'postsRetrievalConfig',
  },
  {
    paramName: 'retrieveComments',
    actionType: 'st.retrievePersonComments',
    configSource: 'commentsRetrievalConfig',
  },
  {
    paramName: 'retrieveReactions',
    actionType: 'st.retrievePersonReactions',
    configSource: 'reactionsRetrievalConfig',
  },
];

const RESPONSE_MAPPINGS = [
  {
    actionType: 'st.retrievePersonExperience',
    targetProperty: 'experiences',
  },
  {
    actionType: 'st.retrievePersonEducation',
    targetProperty: 'education',
  },
  {
    actionType: 'st.retrievePersonSkills',
    targetProperty: 'skills',
  },
  {
    actionType: 'st.retrievePersonLanguages',
    targetProperty: 'languages',
  },
  {
    actionType: 'st.retrievePersonPosts',
    targetProperty: 'posts',
  },
  {
    actionType: 'st.retrievePersonComments',
    targetProperty: 'comments',
  },
  {
    actionType: 'st.retrievePersonReactions',
    targetProperty: 'reactions',
  },
];

export class FetchPersonMapper<TParams extends TBaseFetchPersonParams> extends ThenWorkflowMapper<
  TParams,
  TFetchPersonResult
> {
  constructor() {
    super({
      actionConfigs: FETCH_PERSON_ACTIONS,
      responseMappings: RESPONSE_MAPPINGS,
      baseActionType: 'st.openPersonPage',
      defaultParams: {
        basicInfo: true,
      },
    });
  }
}
