import { WaitForCompletionOptions } from '../core/workflow-executor';
import { TSupportedFunctionName } from '../core/workflow-restoration';
import { BaseMapper, TMappedResponse } from '../mappers/base-mapper.abstract';
import {
  HttpClient,
  LinkedApiError,
  LinkedApiWorkflowTimeoutError,
  TLinkedApiErrorType,
  TWorkflowResponse,
} from '../types';

export abstract class PredefinedOperation<TParams, TResult> {
  protected abstract readonly functionName: TSupportedFunctionName;
  protected abstract readonly mapper: BaseMapper<TParams, TResult>;

  constructor(private readonly httpClient: HttpClient) {}

  public async execute(params: TParams): Promise<string> {
    const request = this.mapper.mapRequest(params);
    const response = await this.httpClient.post<TWorkflowResponse>(`/workflows`, request);
    if (response.error) {
      throw new LinkedApiError(response.error.type as TLinkedApiErrorType, response.error.message);
    }
    if (!response.result) {
      throw LinkedApiError.unknownError();
    }
    return response.result.workflowId;
  }

  public async result(
    workflowId: string,
    options: WaitForCompletionOptions = {},
  ): Promise<TMappedResponse<TResult>> {
    try {
      const rawResult = await this.getResult(workflowId, options);

      if (!this.mapper) {
        return {
          data: rawResult as TResult,
          errors: [],
        };
      }

      return this.mapper.mapResponse(rawResult);
    } catch (error) {
      if (error instanceof LinkedApiError && error.type === 'workflowTimeout') {
        throw new LinkedApiWorkflowTimeoutError(workflowId, this.functionName);
      }
      throw error;
    }
  }

  public async getResult(
    workflowId: string,
    options: WaitForCompletionOptions,
  ): Promise<TWorkflowResponse> {
    const { pollInterval = 5000, timeout = 24 * 60 * 60 * 1000 } = options;
    const startTime = Date.now();

    while (Date.now() - startTime < timeout) {
      const result = await this.getWorkflowResult(workflowId);

      if (result.workflowStatus === 'completed' || result.workflowStatus === 'failed') {
        return result;
      }

      await this.sleep(pollInterval);
    }

    throw new LinkedApiError(
      'workflowTimeout',
      `Workflow ${workflowId} did not complete within ${timeout}ms`,
    );
  }

  public async getWorkflowResult(workflowId: string): Promise<TWorkflowResponse> {
    const response = await this.httpClient.get<TWorkflowResponse>(`/workflows/${workflowId}`);
    if (response.error) {
      throw new LinkedApiError(response.error.type as TLinkedApiErrorType, response.error.message);
    }
    if (!response.result) {
      throw LinkedApiError.unknownError();
    }
    return response.result;
  }

  private async sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
