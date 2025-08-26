import { Operation, TOperationName } from '../core';
import { TActionConfig, ThenWorkflowMapper } from '../mappers/then-workflow-mapper.abstract';
import {
  HttpClient,
  TBaseFetchCompanyParams,
  TFetchCompanyParams,
  TFetchCompanyResult,
} from '../types';

export class FetchCompany extends Operation<TBaseFetchCompanyParams, TFetchCompanyResult> {
  public override readonly operationName: TOperationName = 'fetchCompany';
  protected override readonly mapper = new FetchCompanyMapper();

  constructor(httpClient: HttpClient) {
    super(httpClient);
  }

  public override async execute<TParams extends TBaseFetchCompanyParams>(
    params: TFetchCompanyParams<TParams>,
  ): Promise<string> {
    return super.execute(params);
  }
}

const FETCH_COMPANY_ACTIONS: TActionConfig[] = [
  {
    paramName: 'retrieveEmployees',
    actionType: 'st.retrieveCompanyEmployees',
    configSource: 'employeesRetrievalConfig',
  },
  {
    paramName: 'retrieveDMs',
    actionType: 'st.retrieveCompanyDMs',
    configSource: 'dmsRetrievalConfig',
  },
  {
    paramName: 'retrievePosts',
    actionType: 'st.retrieveCompanyPosts',
    configSource: 'postsRetrievalConfig',
  },
];

const RESPONSE_MAPPINGS = [
  {
    actionType: 'st.retrieveCompanyEmployees',
    targetProperty: 'employees',
  },
  {
    actionType: 'st.retrieveCompanyDMs',
    targetProperty: 'dms',
  },
  {
    actionType: 'st.retrieveCompanyPosts',
    targetProperty: 'posts',
  },
];

export class FetchCompanyMapper<TParams extends TBaseFetchCompanyParams> extends ThenWorkflowMapper<
  TParams,
  TFetchCompanyResult
> {
  constructor() {
    super({
      actionConfigs: FETCH_COMPANY_ACTIONS,
      responseMappings: RESPONSE_MAPPINGS,
      baseActionType: 'st.openCompanyPage',
      defaultParams: {
        basicInfo: true,
      },
    });
  }
}
