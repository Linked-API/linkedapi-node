import type {
  TNvBaseFetchCompanyParams,
  TNvFetchCompanyResult,
} from "../types/actions/company.sales-navigator";
import {
  ThenWorkflowMapper,
  type TActionConfig,
} from "./then-workflow-mapper.abstract";

const FETCH_NV_COMPANY_ACTIONS: TActionConfig[] = [
  {
    paramName: "retrieveEmployees",
    actionType: "nv.retrieveCompanyEmployees",
    configSource: "employeeRetrievalConfig",
  },
  {
    paramName: "retrieveDms",
    actionType: "nv.retrieveCompanyDMs",
    configSource: "dmRetrievalConfig",
  },
];

const RESPONSE_MAPPINGS = [
  {
    actionType: "nv.retrieveCompanyEmployees",
    targetProperty: "employees",
  },
  {
    actionType: "nv.retrieveCompanyDMs",
    targetProperty: "dms",
  },
];

export class AcFetchNvCompanyMapper<
  TParams extends TNvBaseFetchCompanyParams,
> extends ThenWorkflowMapper<TParams, TNvFetchCompanyResult<TParams>> {
  constructor() {
    super({
      actionConfigs: FETCH_NV_COMPANY_ACTIONS,
      responseMappings: RESPONSE_MAPPINGS,
      baseActionType: "nv.openCompanyPage",
      defaultParams: {
        basicInfo: true,
      },
    });
  }
}
