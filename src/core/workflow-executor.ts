import type { HttpClient, TLinkedApiErrorType } from "../types";
import type {
  TWorkflowDefinition,
  TWorkflowResponse,
} from "../types/workflows";
import { LinkedApiError } from "../types/errors";
import { setTimeout as sleep } from "node:timers/promises";

/**
 * Options for waiting for a workflow to complete.
 * @property pollInterval - The interval in milliseconds to poll for the workflow result. Defaults to 5000ms.
 * @property timeout - The maximum time in milliseconds to wait for the workflow to complete. Defaults to 24 hours.
 */
export interface WaitForCompletionOptions {
  pollInterval?: number;
  timeout?: number;
}

export class WorkflowExecutor {
  private readonly httpClient: HttpClient;
  private readonly apiPath: string;
  private readonly workflowTimeout: number;

  constructor({
    httpClient,
    apiPath,
    workflowTimeout,
  }: {
    httpClient: HttpClient;
    apiPath: string;
    workflowTimeout: number;
  }) {
    this.httpClient = httpClient;
    this.apiPath = apiPath;
    this.workflowTimeout = workflowTimeout;
  }

  public async startWorkflow(
    request: TWorkflowDefinition,
  ): Promise<TWorkflowResponse> {
    const response = await this.httpClient.post<TWorkflowResponse>(
      `${this.apiPath}`,
      request,
    );
    if (response.error) {
      throw new LinkedApiError(
        response.error.type as TLinkedApiErrorType,
        response.error.message,
      );
    }
    if (!response.result) {
      throw LinkedApiError.unknownError();
    }
    return response.result;
  }

  public async result(
    workflowId: string,
    options: WaitForCompletionOptions,
  ): Promise<TWorkflowResponse> {
    const {
      pollInterval = 5000,
      timeout = this.workflowTimeout ?? 24 * 60 * 60 * 1000,
    } = options;
    const startTime = Date.now();

    while (Date.now() - startTime < timeout) {
      const result = await this.getWorkflowResult(workflowId);

      if (
        result.workflowStatus === "completed" ||
        result.workflowStatus === "failed"
      ) {
        return result;
      }

      await sleep(pollInterval);
    }

    throw new LinkedApiError(
      "workflowTimeout",
      `Workflow ${workflowId} did not complete within ${timeout}ms`,
    );
  }

  public async getWorkflowResult(
    workflowId: string,
  ): Promise<TWorkflowResponse> {
    const response = await this.httpClient.get<TWorkflowResponse>(
      `${this.apiPath}/${workflowId}`,
    );
    if (response.error) {
      throw new LinkedApiError(
        response.error.type as TLinkedApiErrorType,
        response.error.message,
      );
    }
    if (!response.result) {
      throw LinkedApiError.unknownError();
    }
    return response.result;
  }
}
