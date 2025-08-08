import type {
  TNvSearchPeopleParams,
  TNvSearchPeopleResult,
} from "../types/actions/search-people";
import { ArrayWorkflowMapper } from "./array-workflow-mapper.abstract";

export class AcSalesNavigatorSearchPeopleMapper extends ArrayWorkflowMapper<
  TNvSearchPeopleParams,
  TNvSearchPeopleResult
> {
  constructor() {
    super({
      baseActionType: "nv.searchPeople",
    });
  }
}
