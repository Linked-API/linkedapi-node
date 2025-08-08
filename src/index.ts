import { AccountApi } from "./account-api/account-api";
import type { TLinkedApiConfig } from "./types/config";
import { LinkedApiError, LinkedApiWorkflowError } from "./types/errors";
import type { TWorkflowDefinition, TWorkflowResponse } from "./types/workflows";
import type { TLinkedApiResponse } from "./types/responses";
import { HttpClient } from "./core/http-client";
import { WorkflowExecutor } from "./core/workflow-executor";
import { WorkflowHandler } from "./core/workflow-handler";

/**
 * LinkedApi - Official TypeScript SDK for Linked API
 *
 * The Linked API enables LinkedIn automation and account control.
 *
 * @see {@link https://linkedapi.io Homepage}
 * @see {@link https://linkedapi.io/docs/account-api/ Account API Documentation}
 *
 * @example
 * ```typescript
 * import LinkedApi from "linkedapi-node";
 *
 * // Initialize with Linked API tokens for LinkedIn automation
 * const linkedapi = LinkedApi.init({
 *   accountApiToken: "your-account-api-token",
 *   identificationToken: "your-identification-token"
 * });
 *
 * // Use Linked API features with full type safety
 * const personWorkflow = await linkedapi.account.fetchPerson({
 *   personUrl: "https://www.linkedin.com/in/john-doe",
 *   retrieveExperience: true,
 *   retrievePosts: true,
 *   postsRetrievalConfig: { limit: 10 }
 * });
 * const personData = await personWorkflow.result();
 * ```
 *
 * @example
 * ```typescript
 * // Initialize with both APIs for full functionality
 * const linkedapi = LinkedApi.init({
 *   accountApiToken: "your-account-api-token",
 *   identificationToken: "your-identification-token",
 * });
 * ```
 *
 * @example
 * ```typescript
 * // Error handling
 * try {
 *   const result = await linkedapi.account.fetchPerson({ personUrl: "..." });
 * } catch (error) {
 *   if (error instanceof LinkedApi.LinkedApiError) {
 *     console.error("API Error:", error.message);
 *   }
 * }
 * ```
 */
class LinkedApi {
  /**
   * Initialize LinkedApi client with your API tokens.
   *
   * @param config - Configuration object containing API tokens and optional settings
   * @returns LinkedApi instance with access to account and data APIs
   */
  public readonly account: AccountApi;

  constructor(config: TLinkedApiConfig) {
    const workflowTimeout = config.workflowTimeout ?? 24 * 60 * 60 * 1000;

    const accountApiClient = new HttpClient({
      headers: {
        "account-api-token": config.apiToken,
        "identification-token": config.identificationToken,
      },
    });
    const accountApiExecutor = new WorkflowExecutor({
      httpClient: accountApiClient,
      apiPath: "/account/workflows",
      workflowTimeout: workflowTimeout,
    });
    this.account = new AccountApi(accountApiExecutor, accountApiClient);
  }

  // Error classes
  static LinkedApiError = LinkedApiError;
  static LinkedApiWorkflowError = LinkedApiWorkflowError;
}

export default LinkedApi;

export {
  LinkedApi,
  AccountApi,
  LinkedApiError,
  LinkedApiWorkflowError,
  WorkflowHandler,
};

export type {
  TLinkedApiConfig,
  TLinkedApiResponse,
  TWorkflowDefinition,
  TWorkflowResponse,
};

export * from "./types";
