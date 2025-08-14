import type {
  TNvSearchCompanyParams,
  TNvSearchCompanyResult,
} from "../types/actions/search-company";
import { ArrayWorkflowMapper } from "./array-workflow-mapper.abstract";

export class NvSearchCompaniesMapper extends ArrayWorkflowMapper<
  TNvSearchCompanyParams,
  TNvSearchCompanyResult
> {
  constructor() {
    super({
      baseActionType: "nv.searchCompanies",
    });
  }
}
