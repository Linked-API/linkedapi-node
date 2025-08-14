import type {
  TSearchCompanyParams,
  TSearchCompanyResult,
} from "../types/actions/search-company";
import { ArrayWorkflowMapper } from "./array-workflow-mapper.abstract";

export class SearchCompaniesMapper extends ArrayWorkflowMapper<
  TSearchCompanyParams,
  TSearchCompanyResult
> {
  constructor() {
    super({
      baseActionType: "st.searchCompanies",
    });
  }
}
