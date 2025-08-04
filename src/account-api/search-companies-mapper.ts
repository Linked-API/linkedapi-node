import type {
  TSearchCompanyParams,
  TSearchCompanyResult,
} from "../types/actions/search-company";
import { ArrayWorkflowMapper } from "../core/array-workflow-mapper.abstract";

export class AcSearchCompaniesMapper extends ArrayWorkflowMapper<
  TSearchCompanyParams,
  TSearchCompanyResult
> {
  constructor() {
    super({
      baseActionType: "st.searchCompanies",
    });
  }
}
