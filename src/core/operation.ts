import { BaseMapper, TMappedResponse } from '../mappers/base-mapper.abstract';
import {
  HttpClient,
  LinkedApiError,
  LinkedApiWorkflowTimeoutError,
  TLinkedApiErrorType,
  TWorkflowCancelResponse,
  TWorkflowCompletion,
  TWorkflowResponse,
  TWorkflowRunningStatus,
} from '../types';

import { pollWorkflowResult } from './poll-results';

export const OPERATION_NAME = {
  customWorkflow: 'customWorkflow',
  sendMessage: 'sendMessage',
  syncConversation: 'syncConversation',
  checkConnectionStatus: 'checkConnectionStatus',
  sendConnectionRequest: 'sendConnectionRequest',
  withdrawConnectionRequest: 'withdrawConnectionRequest',
  retrievePendingRequests: 'retrievePendingRequests',
  retrieveConnections: 'retrieveConnections',
  removeConnection: 'removeConnection',
  searchCompanies: 'searchCompanies',
  searchPeople: 'searchPeople',
  fetchPerson: 'fetchPerson',
  fetchCompany: 'fetchCompany',
  fetchPost: 'fetchPost',
  reactToPost: 'reactToPost',
  commentOnPost: 'commentOnPost',
  createPost: 'createPost',
  retrieveSSI: 'retrieveSSI',
  retrievePerformance: 'retrievePerformance',
  nvSendMessage: 'nvSendMessage',
  nvSyncConversation: 'nvSyncConversation',
  nvSearchCompanies: 'nvSearchCompanies',
  nvSearchPeople: 'nvSearchPeople',
  nvFetchCompany: 'nvFetchCompany',
  nvFetchPerson: 'nvFetchPerson',
} as const;
export type TOperationName = (typeof OPERATION_NAME)[keyof typeof OPERATION_NAME];

export interface WaitForCompletionOptions {
  pollInterval?: number;
  timeout?: number;
}

export abstract class Operation<TParams, TResult> {
  public abstract readonly operationName: TOperationName;
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
      return await pollWorkflowResult<TMappedResponse<TResult>>(
        () => this.status(workflowId),
        options,
      );
    } catch (error) {
      if (error instanceof LinkedApiError && error.type === 'workflowTimeout') {
        throw new LinkedApiWorkflowTimeoutError(workflowId, this.operationName);
      }
      throw error;
    }
  }

  public async status(
    workflowId: string,
  ): Promise<TWorkflowRunningStatus | TMappedResponse<TResult>> {
    const workflowResult = await this.getWorkflowResult(workflowId);
    if (workflowResult.workflowStatus === 'running') {
      return workflowResult.workflowStatus;
    }
    const result = this.getCompletion(workflowResult);
    return this.mapper.mapResponse(result);
  }

  public async cancel(workflowId: string): Promise<boolean> {
    const response = await this.httpClient.delete<TWorkflowCancelResponse>(
      `/workflows/${workflowId}`,
    );
    if (response.error) {
      throw new LinkedApiError(response.error.type as TLinkedApiErrorType, response.error.message);
    }
    if (!response.result) {
      throw LinkedApiError.unknownError();
    }
    return response.result.cancelled;
  }

  private async getWorkflowResult(workflowId: string): Promise<TWorkflowResponse> {
    const response = await this.httpClient.get<TWorkflowResponse>(`/workflows/${workflowId}`);
    if (response.error) {
      throw new LinkedApiError(response.error.type as TLinkedApiErrorType, response.error.message);
    }
    if (!response.result) {
      throw LinkedApiError.unknownError();
    }
    return response.result;
  }

  private getCompletion(response: TWorkflowResponse): TWorkflowCompletion {
    if (!response.completion) {
      const { failure } = response;
      if (failure) {
        throw new LinkedApiError(failure.reason as TLinkedApiErrorType, failure.message);
      }
      throw LinkedApiError.unknownError();
    }
    return response.completion;
  }
}
