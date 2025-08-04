import { AccountApi } from "./account-api/account-api";
import { DataApi } from "./data-api/data-api";
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
 * Provides access to both Account API and Data API functionality.
 * The Account API enables LinkedIn automation and account control, while the Data API provides
 * credit-based data retrieval without requiring LinkedIn account access.
 *
 * @see {@link https://linkedapi.io Homepage}
 * @see {@link https://linkedapi.io/docs/account-api/ Account API Documentation}
 * @see {@link https://linkedapi.io/docs/data-api/ Data API Documentation}
 *
 * @example
 * ```typescript
 * import LinkedApi from "linkedapi-node";
 *
 * // Initialize with Account API tokens for LinkedIn automation
 * const linkedapi = LinkedApi.init({
 *   accountApiToken: "your-account-api-token",
 *   identificationToken: "your-identification-token"
 * });
 *
 * // Use Account API features with full type safety
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
 * // Initialize with Data API token for data enrichment (no account required)
 * const linkedapi = LinkedApi.init({
 *   dataApiToken: "your-data-api-token"
 * });
 *
 * // Use Data API features
 * const companies = await linkedapi.data.searchCompanies({
 *   term: "tech startup",
 *   limit: 10
 * });
 * ```
 *
 * @example
 * ```typescript
 * // Initialize with both APIs for full functionality
 * const linkedapi = LinkedApi.init({
 *   accountApiToken: "your-account-api-token",
 *   identificationToken: "your-identification-token",
 *   dataApiToken: "your-data-api-token"
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
  private accountApi?: AccountApi;
  private dataApi?: DataApi;

  constructor(config: TLinkedApiConfig) {
    const workflowTimeout = config.workflowTimeout ?? 24 * 60 * 60 * 1000;

    if (config.accountApiToken && config.identificationToken) {
      const accountApiClient = new HttpClient({
        headers: {
          "account-api-token": config.accountApiToken,
          "identification-token": config.identificationToken,
        },
      });
      const accountApiExecutor = new WorkflowExecutor({
        httpClient: accountApiClient,
        apiPath: "/account/workflows",
        workflowTimeout: workflowTimeout,
      });
      this.accountApi = new AccountApi(accountApiExecutor, accountApiClient);
    }

    if (config.dataApiToken) {
      const dataApiClient = new HttpClient({
        headers: {
          "data-api-token": config.dataApiToken,
        },
      });
      const dataApiExecutor = new WorkflowExecutor({
        httpClient: dataApiClient,
        apiPath: "/data/workflows",
        workflowTimeout: workflowTimeout,
      });
      this.dataApi = new DataApi(dataApiExecutor);
    }
  }

  get account(): AccountApi {
    if (!this.accountApi) {
      throw new Error(
        "Account API is not initialized. Please provide 'accountApiToken' and 'identificationToken' in the configuration.",
      );
    }
    return this.accountApi;
  }

  get data(): DataApi {
    if (!this.dataApi) {
      throw new Error(
        "Data API is not initialized. Please provide 'dataApiToken' in the configuration.",
      );
    }
    return this.dataApi;
  }

  // Error classes
  static LinkedApiError = LinkedApiError;
  static LinkedApiWorkflowError = LinkedApiWorkflowError;
}

export default LinkedApi;

export {
  LinkedApi,
  AccountApi,
  DataApi,
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
