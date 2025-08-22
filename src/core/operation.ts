import { BaseMapper, TMappedResponse } from '../mappers/base-mapper.abstract';
import {
  HttpClient,
  LinkedApiError,
  LinkedApiWorkflowTimeoutError,
  TLinkedApiErrorType,
  TWorkflowCompletion,
  TWorkflowDefinition,
  TWorkflowResponse,
  TWorkflowStatus,
} from '../types';

import { pollWorkflowResult } from './poll-results';

export const OPERATION_NAME = {
  fetchPerson: 'fetchPerson',
  fetchCompany: 'fetchCompany',
  salesNavigatorFetchCompany: 'salesNavigatorFetchCompany',
  salesNavigatorFetchPerson: 'salesNavigatorFetchPerson',
  fetchPost: 'fetchPost',
  searchCompanies: 'searchCompanies',
  salesNavigatorSearchCompanies: 'salesNavigatorSearchCompanies',
  searchPeople: 'searchPeople',
  salesNavigatorSearchPeople: 'salesNavigatorSearchPeople',
  sendMessage: 'sendMessage',
  syncConversation: 'syncConversation',
  salesNavigatorSendMessage: 'salesNavigatorSendMessage',
  salesNavigatorSyncConversation: 'salesNavigatorSyncConversation',
  sendConnectionRequest: 'sendConnectionRequest',
  checkConnectionStatus: 'checkConnectionStatus',
  withdrawConnectionRequest: 'withdrawConnectionRequest',
  retrievePendingRequests: 'retrievePendingRequests',
  retrieveConnections: 'retrieveConnections',
  removeConnection: 'removeConnection',
  reactToPost: 'reactToPost',
  commentOnPost: 'commentOnPost',
  retrieveSSI: 'retrieveSSI',
  retrievePerformance: 'retrievePerformance',
  customWorkflow: 'customWorkflow',
} as const;
export type TOperationName = (typeof OPERATION_NAME)[keyof typeof OPERATION_NAME];

export interface WaitForCompletionOptions {
  pollInterval?: number;
  timeout?: number;
}

export abstract class PredefinedOperation<TParams, TResult> {
  protected abstract readonly functionName: TOperationName;
  protected abstract readonly mapper: BaseMapper<TParams, TResult>;

  private readonly operation: CustomWorkflowOperation;

  constructor(httpClient: HttpClient) {
    this.operation = new CustomWorkflowOperation(httpClient);
  }

  public async execute(params: TParams): Promise<string> {
    const request = this.mapper.mapRequest(params);
    return this.operation.execute(request);
  }

  public async result(
    workflowId: string,
    options: WaitForCompletionOptions = {},
  ): Promise<TMappedResponse<TResult>> {
    try {
      const rawResult = await this.operation.result(workflowId, options);
      return this.mapper.mapResponse(rawResult);
    } catch (error) {
      if (error instanceof LinkedApiError && error.type === 'workflowTimeout') {
        throw new LinkedApiWorkflowTimeoutError(workflowId, this.functionName);
      }
      throw error;
    }
  }

  public async immediateResult(
    workflowId: string,
  ): Promise<TWorkflowStatus | TMappedResponse<TResult>> {
    const result = await this.operation.immediateResult(workflowId);
    if (result === 'running') {
      return result;
    }
    return this.mapper.mapResponse(result as TWorkflowCompletion);
  }
}

export class CustomWorkflowOperation {
  constructor(private readonly httpClient: HttpClient) {}

  public async execute(params: TWorkflowDefinition): Promise<string> {
    const response = await this.httpClient.post<TWorkflowResponse>(`/workflows`, params);
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
  ): Promise<TWorkflowCompletion> {
    try {
      return pollWorkflowResult(
        workflowId,
        (workflowId) => this.immediateResult(workflowId),
        options,
      );
    } catch (error) {
      if (error instanceof LinkedApiError && error.type === 'workflowTimeout') {
        throw new LinkedApiWorkflowTimeoutError(workflowId, 'customWorkflow');
      }
      throw error;
    }
  }

  public async immediateResult(workflowId: string): Promise<TWorkflowStatus | TWorkflowCompletion> {
    const workflowResult = await this.getWorkflowResult(workflowId);
    if (workflowResult.workflowStatus === 'running') {
      return workflowResult.workflowStatus;
    }
    return this.getCompletion(workflowResult);
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
