import type { TFetchPostParams, TFetchPostResult } from "../types/actions/post";
import { SimpleWorkflowMapper } from "../core/simple-workflow-mapper";

export class DtFetchPostMapper extends SimpleWorkflowMapper<
  TFetchPostParams,
  TFetchPostResult
> {
  constructor() {
    super({
      actionType: "openPost",
      defaultParams: {
        basicInfo: true,
      },
    });
  }
}
