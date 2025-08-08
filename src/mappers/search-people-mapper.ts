import type {
  TSearchPeopleParams,
  TSearchPeopleResult,
} from "../types/actions/search-people";
import { ArrayWorkflowMapper } from "./array-workflow-mapper.abstract";

export class AcSearchPeopleMapper extends ArrayWorkflowMapper<
  TSearchPeopleParams,
  TSearchPeopleResult
> {
  constructor() {
    super({
      baseActionType: "st.searchPeople",
    });
  }
}
