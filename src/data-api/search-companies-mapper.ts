import type {
  TNvSearchCompanyParams,
  TNvSearchCompanyResult,
} from "../types/actions/search-company";
import { ArrayWorkflowMapper } from "../core/array-workflow-mapper.abstract";

export class DtSearchCompaniesMapper extends ArrayWorkflowMapper<
  TNvSearchCompanyParams,
  TNvSearchCompanyResult
> {
  constructor() {
    super({
      baseActionType: "searchCompanies",
    });
  }
}
