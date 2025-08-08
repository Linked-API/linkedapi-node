import type {
  TNvSearchCompanyParams,
  TNvSearchCompanyResult,
} from "../types/actions/search-company";
import { ArrayWorkflowMapper } from "./array-workflow-mapper.abstract";

export class AcSalesNavigatorSearchCompaniesMapper extends ArrayWorkflowMapper<
  TNvSearchCompanyParams,
  TNvSearchCompanyResult
> {
  constructor() {
    super({
      baseActionType: "nv.searchCompanies",
    });
  }
}
