import type {
  TNvBaseFetchCompanyParams,
  TNvFetchCompanyResult,
} from "../types/actions/company";
import {
  ThenWorkflowMapper,
  type TActionConfig,
} from "./then-workflow-mapper.abstract";

const FETCH_NV_COMPANY_ACTIONS: TActionConfig[] = [
  {
    paramName: "retrieveEmployees",
    actionType: "nv.retrieveCompanyEmployees",
    configSource: "employeesRetrievalConfig",
  },
  {
    paramName: "retrieveDMs",
    actionType: "nv.retrieveCompanyDMs",
    configSource: "dmsRetrievalConfig",
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

export class NvFetchCompanyMapper<
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
