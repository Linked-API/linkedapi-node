import type {
  TDtBaseFetchCompanyParams,
  TDtFetchCompanyResult,
} from "../types/actions/company.sales-navigator";
import {
  ThenWorkflowMapper,
  type TActionConfig,
} from "../core/then-workflow-mapper.abstract";

const FETCH_COMPANY_ACTIONS: TActionConfig[] = [
  {
    paramName: "retrieveEmployees",
    actionType: "retrieveCompanyEmployees",
    configSource: "employeeRetrievalConfig",
  },
  {
    paramName: "retrieveDms",
    actionType: "retrieveCompanyDMs",
    configSource: "dmRetrievalConfig",
  },
];

const RESPONSE_MAPPINGS = [
  {
    actionType: "retrieveCompanyEmployees",
    targetProperty: "employees",
  },
  {
    actionType: "retrieveCompanyDMs",
    targetProperty: "dms",
  },
];

export class DtFetchCompanyMapper<
  TParams extends TDtBaseFetchCompanyParams,
> extends ThenWorkflowMapper<TParams, TDtFetchCompanyResult<TParams>> {
  constructor() {
    super({
      actionConfigs: FETCH_COMPANY_ACTIONS,
      responseMappings: RESPONSE_MAPPINGS,
      baseActionType: "openCompanyPage",
      defaultParams: {
        basicInfo: true,
      },
    });
  }
}
