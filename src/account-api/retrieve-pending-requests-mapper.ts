import type { TRetrievePendingRequestsResult } from "../types/actions/connection";
import { ArrayWorkflowMapper } from "../core/array-workflow-mapper.abstract";
import { TBaseActionParams } from "src/types/params";

export class AcRetrievePendingRequestsMapper extends ArrayWorkflowMapper<
  TBaseActionParams,
  TRetrievePendingRequestsResult
> {
  constructor() {
    super({
      baseActionType: "st.retrievePendingRequests",
    });
  }
}
