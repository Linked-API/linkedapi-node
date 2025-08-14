import type {
  TRetrieveConnectionsParams,
  TRetrieveConnectionsResult,
} from "../types/actions/connection";
import { ArrayWorkflowMapper } from "./array-workflow-mapper.abstract";

export class RetrieveConnectionsMapper extends ArrayWorkflowMapper<
  TRetrieveConnectionsParams,
  TRetrieveConnectionsResult
> {
  constructor() {
    super({
      baseActionType: "st.retrieveConnections",
    });
  }
}
