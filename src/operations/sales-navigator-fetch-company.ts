import { TSupportedFunctionName } from '../core';
import { PredefinedOperation } from '../core/base-operation.abstract';
import { TActionConfig, ThenWorkflowMapper } from '../mappers/then-workflow-mapper.abstract';
import { TNvBaseFetchCompanyParams, TNvFetchCompanyParams, TNvFetchCompanyResult } from '../types';

export class SalesNavigatorFetchCompany extends PredefinedOperation<
  TNvBaseFetchCompanyParams,
  TNvFetchCompanyResult
> {
  protected override readonly functionName: TSupportedFunctionName = 'salesNavigatorFetchCompany';
  protected override readonly mapper = new NvFetchCompanyMapper();

  public override async execute<TParams extends TNvBaseFetchCompanyParams>(
    params: TNvFetchCompanyParams<TParams>,
  ): Promise<string> {
    return super.execute(params);
  }
}

const FETCH_NV_COMPANY_ACTIONS: TActionConfig[] = [
  {
    paramName: 'retrieveEmployees',
    actionType: 'nv.retrieveCompanyEmployees',
    configSource: 'employeesRetrievalConfig',
  },
  {
    paramName: 'retrieveDMs',
    actionType: 'nv.retrieveCompanyDMs',
    configSource: 'dmsRetrievalConfig',
  },
];

const RESPONSE_MAPPINGS = [
  {
    actionType: 'nv.retrieveCompanyEmployees',
    targetProperty: 'employees',
  },
  {
    actionType: 'nv.retrieveCompanyDMs',
    targetProperty: 'dms',
  },
];

export class NvFetchCompanyMapper<
  TParams extends TNvBaseFetchCompanyParams,
> extends ThenWorkflowMapper<TParams, TNvFetchCompanyResult> {
  constructor() {
    super({
      actionConfigs: FETCH_NV_COMPANY_ACTIONS,
      responseMappings: RESPONSE_MAPPINGS,
      baseActionType: 'nv.openCompanyPage',
      defaultParams: {
        basicInfo: true,
      },
    });
  }
}
