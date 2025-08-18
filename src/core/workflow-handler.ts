import type { TBaseActionParams } from "../types/params";
import type {
  BaseMapper,
  TMappedResponse,
} from "../mappers/base-mapper.abstract";
import type { TWorkflowResponse } from "../types/workflows";
import type {
  WaitForCompletionOptions,
  WorkflowExecutor,
} from "./workflow-executor";
import { TSupportedFunctionName } from "../core/workflow-restoration";
import { LinkedApiError, LinkedApiWorkflowTimeoutError } from "../types";

export class WorkflowHandler<TResult = TWorkflowResponse> {
  constructor(
    public readonly workflowId: string,
    public readonly functionName: TSupportedFunctionName,
    private readonly workflowExecutor: WorkflowExecutor,
    private readonly mapper?: BaseMapper<TBaseActionParams, TResult>,
  ) {}

  public async result(
    options: WaitForCompletionOptions = {},
  ): Promise<TMappedResponse<TResult>> {
    try {
      const rawResult = await this.workflowExecutor.result(
        this.workflowId,
        options,
      );

      if (!this.mapper) {
        return {
          data: rawResult as TResult,
          errors: [],
        };
      }

      return this.mapper.mapResponse(rawResult);
    } catch (error) {
      if (error instanceof LinkedApiError && error.type === "timeout") {
        throw new LinkedApiWorkflowTimeoutError(
          this.workflowId,
          this.functionName,
        );
      }
      throw error;
    }
  }
}
