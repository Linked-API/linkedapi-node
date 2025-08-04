import type { TBaseActionParams } from "../types/params";
import type { BaseMapper } from "./base-mapper.abstract";
import type { TWorkflowResponse } from "../types/workflows";
import type {
  WaitForCompletionOptions,
  WorkflowExecutor,
} from "./workflow-executor";

export class WorkflowHandler<TResult = TWorkflowResponse> {
  constructor(
    public readonly workflowId: string,
    private readonly workflowExecutor: WorkflowExecutor,
    private readonly mapper?: BaseMapper<TBaseActionParams, TResult>,
  ) {}

  public async result(
    options: WaitForCompletionOptions = {},
  ): Promise<TResult> {
    const rawResult = await this.workflowExecutor.result(
      this.workflowId,
      options,
    );

    if (!this.mapper) {
      return rawResult as TResult;
    }

    return this.mapper.mapResponse(rawResult);
  }
}
