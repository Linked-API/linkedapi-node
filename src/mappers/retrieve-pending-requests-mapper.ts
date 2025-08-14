import type { TRetrievePendingRequestsResult } from "../types/actions/connection";
import { ArrayWorkflowMapper } from "./array-workflow-mapper.abstract";
import { TBaseActionParams } from "../types/params";

export class RetrievePendingRequestsMapper extends ArrayWorkflowMapper<
  TBaseActionParams,
  TRetrievePendingRequestsResult
> {
  constructor() {
    super({
      baseActionType: "st.retrievePendingRequests",
    });
  }
}
