import type {
  TNvSearchPeopleParams,
  TNvSearchPeopleResult,
} from "../types/actions/search-people";
import { ArrayWorkflowMapper } from "../core/array-workflow-mapper.abstract";

export class DtSearchPeopleMapper extends ArrayWorkflowMapper<
  TNvSearchPeopleParams,
  TNvSearchPeopleResult
> {
  constructor() {
    super({
      baseActionType: "searchPeople",
    });
  }
}
