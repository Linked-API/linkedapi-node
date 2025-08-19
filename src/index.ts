import type { TLinkedApiConfig } from "./types/config";
import type { TWorkflowDefinition, TWorkflowResponse } from "./types/workflows";
import type { TLinkedApiResponse } from "./types/responses";
import { buildLinkedApiHttpClient } from "./core/linked-api-http-client";
import { WorkflowExecutor } from "./core/workflow-executor";
import { WorkflowHandler } from "./core/workflow-handler";
import type {
  TMappedResponse,
  BaseMapper,
} from "./mappers/base-mapper.abstract";

import {
  FetchCompanyMapper,
  NvFetchCompanyMapper,
  FetchPersonMapper,
  NvFetchPersonMapper,
  RetrieveConnectionsMapper,
  RetrievePendingRequestsMapper,
  NvSearchCompaniesMapper,
  NvSearchPeopleMapper,
  SearchCompaniesMapper,
  SearchPeopleMapper,
  SimpleWorkflowMapper,
  VoidWorkflowMapper,
} from "./mappers";
import {
  TSendMessageParams,
  TSyncConversationParams,
  TNvSendMessageParams,
  TNvSyncConversationParams,
  TConversationPollRequest,
  TConversationPollResponse,
  TConversationPollResult,
  TBaseFetchPersonParams,
  TFetchPersonParams,
  TFetchPersonResult,
  TNvOpenPersonPageParams,
  TNvOpenPersonPageResult,
  TBaseFetchCompanyParams,
  TFetchCompanyParams,
  TFetchCompanyResult,
  TNvBaseFetchCompanyParams,
  TNvFetchCompanyParams,
  TNvFetchCompanyResult,
  TFetchPostParams,
  TFetchPostResult,
  TSearchCompanyParams,
  TSearchCompanyResult,
  TNvSearchCompanyParams,
  TNvSearchCompanyResult,
  TSearchPeopleParams,
  TSearchPeopleResult,
  TNvSearchPeopleParams,
  TNvSearchPeopleResult,
  TSendConnectionRequestParams,
  TCheckConnectionStatusParams,
  TCheckConnectionStatusResult,
  TWithdrawConnectionRequestParams,
  TRetrievePendingRequestsResult,
  TRetrieveConnectionsParams,
  TRetrieveConnectionsResult,
  TRemoveConnectionParams,
  TReactToPostParams,
  TCommentOnPostParams,
  TRetrieveSSIResult,
  TBaseActionParams,
  TRetrievePerformanceResult,
  TApiUsageStatsParams,
  TApiUsageStatsResponse,
  TApiUsageAction,
  HttpClient,
} from "./types";
import {
  TRestoreResultType,
  TSupportedFunctionName,
  createMapperFromFunctionName,
} from "./core/workflow-restoration";

/**
 * LinkedApi - Official TypeScript SDK for Linked API
 *
 * The Linked API enables LinkedIn automation and account control.
 *
 * @see {@link https://linkedapi.io Homepage}
 * @see {@link https://linkedapi.io/docs/ Linked API Documentation}
 *
 * @example
 * ```typescript
 * import LinkedApi from "linkedapi-node";
 *
 * // Initialize with Linked API tokens for LinkedIn automation
 * const linkedapi = new LinkedApi({
 *   linkedApiToken: "your-linked-api-token",
 *   identificationToken: "your-identification-token"
 * });
 *
 * // Use Linked API features with full type safety
 * const personWorkflow = await linkedapi.fetchPerson({
 *   personUrl: "https://www.linkedin.com/in/john-doe",
 *   retrieveExperience: true,
 *   retrievePosts: true,
 *   postsRetrievalConfig: { limit: 10 }
 * });
 * const personResult = await personWorkflow.result();
 * ```
 */
class LinkedApi {
  private readonly httpClient: HttpClient;
  private readonly workflowExecutor: WorkflowExecutor;

  /**
   * Initialize LinkedApi client with your API tokens.
   *
   * @param config - Configuration object containing API tokens and optional settings
   * @returns LinkedApi instance with access to LinkedIn automation features
   */
  constructor(config: TLinkedApiConfig);
  constructor(httpClient: HttpClient);
  constructor(configOrClient: TLinkedApiConfig | HttpClient) {
    if (configOrClient instanceof HttpClient) {
      this.httpClient = configOrClient;
    } else {
      this.httpClient = buildLinkedApiHttpClient(configOrClient);
    }
    this.workflowExecutor = new WorkflowExecutor({
      httpClient: this.httpClient,
      apiPath: "/workflows",
      workflowTimeout: 24 * 60 * 60 * 1000,
    });
  }

  /**
   * Execute a custom workflow with raw workflow definition.
   *
   * This method allows you to execute any custom workflow by providing a raw workflow definition.
   * Use this for advanced use cases when you need to create custom action sequences.
   *
   * @param params - The workflow definition containing action types and parameters
   * @returns Promise resolving to a WorkflowHandler for managing the workflow execution
   *
   * @see {@link https://linkedapi.io/docs/ Linked API Documentation}
   * @see {@link https://linkedapi.io/docs/executing-workflows/ Executing Workflows Documentation}
   * @see {@link https://linkedapi.io/docs/building-workflows/ Building Workflows Documentation}
   * @see {@link https://linkedapi.io/docs/actions-overview/ Actions Overview Documentation}
   *
   * @example
   * ```typescript
   * const workflow = await linkedapi.executeCustomWorkflow({
   *   actionType: "st.searchCompanies",
   *   term: "Tech Inc",
   *   filter: {
   *     sizes: ["51-200", "2001-500"],
   *     locations: ["San Francisco", "New York"],
   *     industries: ["Software Development", "Robotics Engineering"],
   *     annualRevenue: {
   *       min: "0",
   *       max: "2.5"
   *     }
   *   },
   *   then: {
   *     actionType: "st.doForCompanies",
   *     then: {
   *       actionType: "st.openCompanyPage",
   *       basicInfo: true
   *     }
   *   }
   * });
   *
   * const result = await workflow.result();
   * ```
   */
  public async executeCustomWorkflow(
    params: TWorkflowDefinition,
  ): Promise<WorkflowHandler> {
    const workflow = await this.workflowExecutor.startWorkflow(params);
    return new WorkflowHandler(
      workflow.workflowId,
      "executeCustomWorkflow",
      this.workflowExecutor,
    );
  }

  /**
   * Restore a WorkflowHandler for a previously started workflow using its ID and function name.
   * This provides full type safety and exact result types based on the function name.
   *
   * @param workflowId - The unique identifier of the workflow to restore
   * @param functionName - The name of the function that was used to create the workflow
   * @returns Promise resolving to a WorkflowHandler with exact result type based on the function name
   *
   * @see {@link https://linkedapi.io/docs/executing-workflows/ Executing Workflows Documentation}
   *
   * @example
   * ```typescript
   * // Restore a person fetching workflow with full type safety
   * const personHandler = await linkedapi.restoreWorkflow("workflow-id-123", "fetchPerson");
   * const personResult = await personHandler.result();
   *
   * const statusHandler = await linkedapi.restoreWorkflow("workflow-id-456", "checkConnectionStatus");
   * const statusResult = await statusHandler.result();
   * // TypeScript knows exact type: TCheckConnectionStatusResult
   * ```
   */
  public async restoreWorkflow<TFunctionName extends TSupportedFunctionName>(
    workflowId: string,
    functionName: TFunctionName,
  ): Promise<WorkflowHandler<TRestoreResultType<TFunctionName>>> {
    const mapper = createMapperFromFunctionName(functionName);

    if (mapper === null) {
      return new WorkflowHandler(
        workflowId,
        functionName,
        this.workflowExecutor,
      ) as WorkflowHandler<TRestoreResultType<TFunctionName>>;
    }

    return new WorkflowHandler(
      workflowId,
      functionName,
      this.workflowExecutor,
      mapper as BaseMapper<TBaseActionParams, unknown>,
    ) as WorkflowHandler<TRestoreResultType<TFunctionName>>;
  }

  // Mapper descriptor based restoration was removed in favor of restoreMapper(functionName, parameters)

  /**
   * Send a message to a LinkedIn user via standard LinkedIn messaging.
   *
   * This method sends a direct message to a person on LinkedIn. The recipient must be a connection
   * or allow messages from anyone. This uses the standard LinkedIn messaging interface.
   *
   * @param params - Parameters including the person's URL and message text
   * @returns Promise resolving to a WorkflowHandler for the message sending action
   *
   * @see {@link https://linkedapi.io/docs/sending-message/ Sending Messages Documentation}
   * @see {@link https://linkedapi.io/docs/action-st-send-message/ st.sendMessage Action Documentation}
   *
   * @example
   * ```typescript
   * const messageWorkflow = await linkedapi.sendMessage({
   *   personUrl: "https://www.linkedin.com/in/john-doe",
   *   text: "Hi John! I saw your recent post about AI and would love to discuss further."
   * });
   *
   * await messageWorkflow.result();
   * console.log("Message sent successfully");
   * ```
   */
  public async sendMessage(
    params: TSendMessageParams,
  ): Promise<WorkflowHandler<void>> {
    const sendMessageMapper = new VoidWorkflowMapper<TSendMessageParams>(
      "st.sendMessage",
    );
    const workflowDefinition = sendMessageMapper.mapRequest(params);
    const { workflowId } =
      await this.workflowExecutor.startWorkflow(workflowDefinition);
    return new WorkflowHandler<void>(
      workflowId,
      "sendMessage" as const,
      this.workflowExecutor,
      sendMessageMapper,
    );
  }

  /**
   * Sync a conversation with a LinkedIn user for standard LinkedIn messaging.
   *
   * This method synchronizes a conversation with a person, preparing it for future message polling.
   * Each conversation must be synced once before you can poll it for messages. This is a time-consuming
   * process that retrieves the conversation history and prepares it for future updates.
   *
   * @param params - Parameters including the person's URL
   * @returns Promise resolving to a WorkflowHandler for the sync action
   *
   * @see {@link https://linkedapi.io/docs/working-with-conversations/ Working with Conversations Documentation}
   * @see {@link https://linkedapi.io/docs/action-st-sync-conversation/ st.syncConversation Action Documentation}
   *
   * @example
   * ```typescript
   * const syncWorkflow = await linkedapi.syncConversation({
   *   personUrl: "https://www.linkedin.com/in/john-doe"
   * });
   *
   * await syncWorkflow.result();
   * console.log("Conversation synced and ready for polling");
   * ```
   */
  public async syncConversation(
    params: TSyncConversationParams,
  ): Promise<WorkflowHandler<void>> {
    const syncConversationMapper =
      new VoidWorkflowMapper<TSyncConversationParams>("st.syncConversation");
    const workflowDefinition = syncConversationMapper.mapRequest(params);
    const { workflowId } =
      await this.workflowExecutor.startWorkflow(workflowDefinition);
    return new WorkflowHandler<void>(
      workflowId,
      "syncConversation" as const,
      this.workflowExecutor,
      syncConversationMapper,
    );
  }

  /**
   * Send a message to a LinkedIn user via Sales Navigator.
   *
   * This method sends a direct message to a person using Sales Navigator's messaging capabilities.
   * Sales Navigator allows messaging people who are not connections and provides enhanced messaging features.
   *
   * @param params - Parameters including the person's URL, message text, and subject line
   * @returns Promise resolving to a WorkflowHandler for the message sending action
   *
   * @see {@link https://linkedapi.io/docs/sending-message/ Sending Messages Documentation}
   * @see {@link https://linkedapi.io/docs/action-nv-send-message/ nv.sendMessage Action Documentation}
   *
   * @example
   * ```typescript
   * const nvMessageWorkflow = await linkedapi.salesNavigatorSendMessage({
   *   personUrl: "https://www.linkedin.com/in/john-doe",
   *   text: "Hi John! I'm reaching out regarding potential collaboration opportunities.",
   *   subject: "Partnership Opportunity"
   * });
   *
   * await nvMessageWorkflow.result();
   * console.log("Sales Navigator message sent successfully");
   * ```
   */
  public async salesNavigatorSendMessage(
    params: TNvSendMessageParams,
  ): Promise<WorkflowHandler<void>> {
    const nvSendMessageMapper = new VoidWorkflowMapper<TNvSendMessageParams>(
      "nv.sendMessage",
    );
    const workflowDefinition = nvSendMessageMapper.mapRequest(params);
    const { workflowId } =
      await this.workflowExecutor.startWorkflow(workflowDefinition);
    return new WorkflowHandler<void>(
      workflowId,
      "salesNavigatorSendMessage" as const,
      this.workflowExecutor,
      nvSendMessageMapper,
    );
  }

  /**
   * Sync a conversation with a LinkedIn user for Sales Navigator messaging.
   *
   * This method synchronizes a Sales Navigator conversation with a person, preparing it for future message polling.
   * Each conversation must be synced once before you can poll it for messages. This retrieves the conversation
   * history from Sales Navigator and prepares it for future updates.
   *
   * @param params - Parameters including the person's URL
   * @returns Promise resolving to a WorkflowHandler for the sync action
   *
   * @see {@link https://linkedapi.io/docs/working-with-conversations/ Working with Conversations Documentation}
   * @see {@link https://linkedapi.io/docs/action-nv-sync-conversation/ nv.syncConversation Action Documentation}
   *
   * @example
   * ```typescript
   * const nvSyncWorkflow = await linkedapi.salesNavigatorSyncConversation({
   *   personUrl: "https://www.linkedin.com/in/john-doe"
   * });
   *
   * await nvSyncWorkflow.result();
   * console.log("Sales Navigator conversation synced and ready for polling");
   * ```
   */
  public async salesNavigatorSyncConversation(
    params: TNvSyncConversationParams,
  ): Promise<WorkflowHandler<void>> {
    const nvSyncConversationMapper =
      new VoidWorkflowMapper<TNvSyncConversationParams>("nv.syncConversation");
    const workflowDefinition = nvSyncConversationMapper.mapRequest(params);
    const { workflowId } =
      await this.workflowExecutor.startWorkflow(workflowDefinition);
    return new WorkflowHandler<void>(
      workflowId,
      "salesNavigatorSyncConversation" as const,
      this.workflowExecutor,
      nvSyncConversationMapper,
    );
  }

  /**
   * Poll multiple conversations to retrieve message history and new messages.
   *
   * This method retrieves messages from one or more previously synced conversations using direct HTTP requests.
   * Unlike syncing, polling is fast and can be done continuously to get real-time message updates.
   * You can specify a timestamp to get only messages since that time.
   *
   * @param conversations - Array of conversation requests specifying person URLs, types, and optional timestamps
   * @returns Promise resolving to a response containing conversation data and messages
   *
   * @see {@link https://linkedapi.io/docs/working-with-conversations/ Working with Conversations Documentation}
   *
   * @example
   * ```typescript
   * // Poll multiple conversations
   * const pollResponse = await linkedapi.pollConversations([
   *   {
   *     personUrl: "https://www.linkedin.com/in/john-doe",
   *     type: "st",
   *     since: "2023-01-01T00:00:00Z"
   *   },
   *   {
   *     personUrl: "https://www.linkedin.com/in/jane-smith",
   *     type: "nv"
   *   }
   * ]);
   *
   * if (pollResponse.success) {
   *   pollResponse.result?.forEach(conversation => {
   *     console.log(`Conversation with ${conversation.personUrl}:`);
   *     console.log(`Messages: ${conversation.messages.length}`);
   *
   *     conversation.messages.forEach(message => {
   *       console.log(`${message.sender}: ${message.text}`);
   *     });
   *   });
   * } else {
   *   console.error("Polling failed:", pollResponse.error?.message);
   * }
   * ```
   */
  public async pollConversations(
    conversations: TConversationPollRequest[],
  ): Promise<TConversationPollResponse> {
    const response = await this.httpClient.post<TConversationPollResult[]>(
      "/conversations/poll",
      conversations,
    );

    return {
      success: response.success,
      result: response.result,
      error: response.error,
    };
  }

  /**
   * Retrieve detailed information about a LinkedIn person profile.
   *
   * This method fetches comprehensive data about a person from their LinkedIn profile,
   * including basic information, experience, education, skills, and more based on the specified parameters.
   *
   * @param params - Parameters specifying the person URL and what data to retrieve
   * @returns Promise resolving to a WorkflowHandler containing the person's profile data
   *
   * @see {@link https://linkedapi.io/docs/visiting-person-page/ Visiting Person Page Documentation}
   * @see {@link https://linkedapi.io/docs/action-st-open-person-page/ st.openPersonPage Action Documentation}
   * @see {@link https://linkedapi.io/docs/action-st-retrieve-person-experience/ st.retrievePersonExperience Child Action}
   * @see {@link https://linkedapi.io/docs/action-st-retrieve-person-education/ st.retrievePersonEducation Child Action}
   * @see {@link https://linkedapi.io/docs/action-st-retrieve-person-skills/ st.retrievePersonSkills Child Action}
   * @see {@link https://linkedapi.io/docs/action-st-retrieve-person-languages/ st.retrievePersonLanguages Child Action}
   * @see {@link https://linkedapi.io/docs/action-st-retrieve-person-posts/ st.retrievePersonPosts Child Action}
   * @see {@link https://linkedapi.io/docs/action-st-retrieve-person-comments/ st.retrievePersonComments Child Action}
   * @see {@link https://linkedapi.io/docs/action-st-retrieve-person-reactions/ st.retrievePersonReactions Child Action}
   *
   * @example
   * ```typescript
   * // Fetch comprehensive person information with type-safe parameters
   * const personWorkflow = await linkedapi.fetchPerson({
   *   personUrl: "https://www.linkedin.com/in/john-doe",
   *   retrieveExperience: true,
   *   retrieveEducation: true,
   *   retrieveSkills: true,
   *   retrieveLanguages: true,
   *   retrievePosts: true,
   *   retrieveComments: true,
   *   retrieveReactions: true,
   *   postsRetrievalConfig: {
   *     limit: 10,
   *     since: "2024-01-01"
   *   },
   *   commentsRetrievalConfig: {
   *     limit: 5,
   *     since: "2024-01-01"
   *   },
   *   reactionsRetrievalConfig: {
   *     limit: 3,
   *     since: "2024-01-01"
   *   }
   * });
   *
   * const personResult = await personWorkflow.result();
   * if (personResult.data) {
   *   console.log("Person name:", personResult.data.name);
   *   console.log("Headline:", personResult.data.headline);
   *   console.log("Experience:", personResult.data.experiences); // TypeScript knows this exists
   *   console.log("Posts:", personResult.data.posts); // TypeScript knows this exists
   * }
   * ```
   *
   * @example
   * ```typescript
   * // Simple fetch without additional data - no config objects needed
   * const basicPersonWorkflow = await linkedapi.fetchPerson({
   *   personUrl: "https://www.linkedin.com/in/john-doe"
   * });
   *
   * const basicResult = await basicPersonWorkflow.result();
   * if (basicResult.data) {
   *   console.log("Basic info:", basicResult.data.name, basicResult.data.headline);
   * }
   * ```
   */
  public async fetchPerson<TParams extends TBaseFetchPersonParams>(
    params: TFetchPersonParams<TParams>,
  ): Promise<WorkflowHandler<TFetchPersonResult<TParams>>> {
    const fetchPersonMapper = new FetchPersonMapper<TParams>();
    const workflowDefinition = fetchPersonMapper.mapRequest(params);
    const { workflowId } =
      await this.workflowExecutor.startWorkflow(workflowDefinition);
    return new WorkflowHandler<TFetchPersonResult<TParams>>(
      workflowId,
      "fetchPerson",
      this.workflowExecutor,
      fetchPersonMapper,
    );
  }

  /**
   * Retrieve person information via Sales Navigator.
   *
   * This method opens a person's profile page in Sales Navigator and retrieves their information.
   * Sales Navigator provides enhanced data and is useful for sales prospecting activities.
   *
   * @param params - Parameters including the person's hashed URL and data options
   * @returns Promise resolving to a WorkflowHandler containing Sales Navigator person data
   *
   * @see {@link https://linkedapi.io/docs/visiting-person-page/ Visiting Person Page Documentation}
   * @see {@link https://linkedapi.io/docs/action-nv-open-person-page/ nv.openPersonPage Action Documentation}
   *
   * @example
   * ```typescript
   * const nvPersonWorkflow = await linkedapi.salesNavigatorFetchPerson({
   *   personHashedUrl: "https://www.linkedin.com/in/ABC123",
   * });
   *
   * const personResult = await nvPersonWorkflow.result();
   * console.log("Sales Navigator data:", personResult.data);
   * ```
   */
  public async salesNavigatorFetchPerson(
    params: TNvOpenPersonPageParams,
  ): Promise<WorkflowHandler<TNvOpenPersonPageResult>> {
    const nvOpenPersonPageMapper = new NvFetchPersonMapper();
    const workflowDefinition = nvOpenPersonPageMapper.mapRequest(params);
    const { workflowId } =
      await this.workflowExecutor.startWorkflow(workflowDefinition);
    return new WorkflowHandler<TNvOpenPersonPageResult>(
      workflowId,
      "salesNavigatorFetchPerson",
      this.workflowExecutor,
      nvOpenPersonPageMapper,
    );
  }

  /**
   * Retrieve detailed information about a LinkedIn company profile.
   *
   * This method fetches comprehensive data about a company from their LinkedIn page,
   * including basic information, employee data, posts, and more based on the specified parameters.
   *
   * @param params - Parameters specifying the company URL and what data to retrieve
   * @returns Promise resolving to a WorkflowHandler containing the company's profile data
   *
   * @see {@link https://linkedapi.io/docs/action-st-open-company-page/ st.openCompanyPage Action Documentation}
   * @see {@link https://linkedapi.io/docs/action-st-retrieve-company-employees/ st.retrieveCompanyEmployees Child Action}
   * @see {@link https://linkedapi.io/docs/action-st-retrieve-company-dms/ st.retrieveCompanyDMs Child Action}
   * @see {@link https://linkedapi.io/docs/action-st-retrieve-company-posts/ st.retrieveCompanyPosts Child Action}
   *
   * @example
   * ```typescript
   * // Fetch company information with employees and posts (new simplified syntax)
   * const companyWorkflow = await linkedapi.fetchCompany({
   *   companyUrl: "https://www.linkedin.com/company/microsoft",
   *   retrieveEmployees: true,
   *   retrievePosts: true,
   *   retrieveDMs: true,
   *   employeesRetrievalConfig: {
   *     limit: 5,
   *     filter: {
   *       firstName: 'John',
   *       lastName: 'Doe',
   *       position: 'engineer',
   *       locations: ['United States'],
   *       industries: ['Software Development', 'Robotics Engineering'],
   *       schools: ['Stanford University', 'Harvard University'],
   *     },
   *   },
   *   postsRetrievalConfig: { limit: 10, since: "2024-01-01" },
   *   dmsRetrievalConfig: { limit: 3 }
   * });
   *
   * const companyResult = await companyWorkflow.result();
   * if (companyResult.data) {
   *   console.log("Company name:", companyResult.data.name);
   *   console.log("Employee count:", companyResult.data.employees?.length);
   *   console.log("Posts:", companyResult.data.posts?.length);
   * }
   * ```
   */
  public async fetchCompany<TParams extends TBaseFetchCompanyParams>(
    params: TFetchCompanyParams<TParams>,
  ): Promise<WorkflowHandler<TFetchCompanyResult<TParams>>> {
    const fetchCompanyMapper = new FetchCompanyMapper<TParams>();
    const workflowDefinition = fetchCompanyMapper.mapRequest(params);
    const { workflowId } =
      await this.workflowExecutor.startWorkflow(workflowDefinition);
    return new WorkflowHandler<TFetchCompanyResult<TParams>>(
      workflowId,
      "fetchCompany" as const,
      this.workflowExecutor,
      fetchCompanyMapper,
    );
  }

  /**
   * Retrieve company information via Sales Navigator.
   *
   * This method opens a company's profile page in Sales Navigator and retrieves their information.
   * Sales Navigator provides enhanced company data and is useful for B2B sales prospecting.
   *
   * @param params - Parameters including the company's hashed URL and data options
   * @returns Promise resolving to a WorkflowHandler containing Sales Navigator company data
   *
   * @see {@link https://linkedapi.io/docs/action-nv-open-company-page/ nv.openCompanyPage Action Documentation}
   * @see {@link https://linkedapi.io/docs/action-nv-retrieve-company-employees/ nv.retrieveCompanyEmployees Child Action}
   * @see {@link https://linkedapi.io/docs/action-nv-retrieve-company-dms/ nv.retrieveCompanyDMs Child Action}
   *
   * @example
   * ```typescript
   * // Sales Navigator company fetch (new simplified syntax)
   * const nvCompanyWorkflow = await linkedapi.salesNavigatorFetchCompany({
   *   companyHashedUrl: 'https://www.linkedin.com/sales/company/1035',
   *   retrieveEmployees: true,
   *   retrieveDMs: true,
   *   employeesRetrievalConfig: {
   *     limit: 1,
   *     filter: {
   *       positions: ['Manager', 'Engineer'],
   *       yearsOfExperiences: ['threeToFive', 'sixToTen'],
   *       industries: ['Software Development', 'Robotics Engineering'],
   *       schools: ['Stanford University', 'Harvard University'],
   *     },
   *   },
   *   dmsRetrievalConfig: {
   *     limit: 2,
   *   },
   * });
   *
   * const companyResult = await nvCompanyWorkflow.result();
   * if (companyResult.data) {
   *   console.log("Company name:", companyResult.data.name);
   *   console.log("Employees:", companyResult.data.employees?.length);
   *   console.log("Decision makers:", companyResult.data.dms?.length);
   * }
   * ```
   */
  public async salesNavigatorFetchCompany<
    TParams extends TNvBaseFetchCompanyParams,
  >(
    params: TNvFetchCompanyParams<TParams>,
  ): Promise<WorkflowHandler<TNvFetchCompanyResult<TParams>>> {
    const fetchNvCompanyMapper = new NvFetchCompanyMapper<TParams>();
    const workflowDefinition = fetchNvCompanyMapper.mapRequest(params);
    const { workflowId } =
      await this.workflowExecutor.startWorkflow(workflowDefinition);
    return new WorkflowHandler<TNvFetchCompanyResult<TParams>>(
      workflowId,
      "salesNavigatorFetchCompany" as const,
      this.workflowExecutor,
      fetchNvCompanyMapper,
    );
  }

  /**
   * Retrieve detailed information about a LinkedIn post.
   *
   * This method fetches comprehensive data about a specific LinkedIn post,
   * including content, author information, engagement metrics, and comments.
   *
   * @param params - Parameters specifying the post URL
   * @returns Promise resolving to a WorkflowHandler containing the post data
   *
   * @see {@link https://linkedapi.io/docs/action-st-open-post/ st.openPost Action Documentation}
   *
   * @example
   * ```typescript
   * const postWorkflow = await linkedapi.fetchPost({
   *   postUrl: "https://www.linkedin.com/posts/john-doe_activity-123456789"
   * });
   *
   * const postResult = await postWorkflow.result();
   * if (postResult.data) {
   *   console.log("Post content:", postResult.data.text);
   *   console.log("Author:", postResult.data.author);
   *   console.log("Reactions:", postResult.data.reactions);
   * }
   * ```
   */
  public async fetchPost(
    params: TFetchPostParams,
  ): Promise<WorkflowHandler<TFetchPostResult>> {
    const fetchPostMapper = new SimpleWorkflowMapper<
      TFetchPostParams,
      TFetchPostResult
    >({
      actionType: "st.openPost",
      defaultParams: {
        basicInfo: true,
      },
    });
    const workflowDefinition = fetchPostMapper.mapRequest(params);
    const { workflowId } =
      await this.workflowExecutor.startWorkflow(workflowDefinition);
    return new WorkflowHandler<TFetchPostResult>(
      workflowId,
      "fetchPost" as const,
      this.workflowExecutor,
      fetchPostMapper,
    );
  }

  /**
   * Search for companies on LinkedIn using standard search.
   *
   * This method performs a company search on LinkedIn using the standard search interface.
   * You can filter by various criteria like location, industry, company size, and more.
   *
   * @param params - Search parameters including keywords, filters, and pagination options
   * @returns Promise resolving to a WorkflowHandler containing an array of company search results
   *
   * @see {@link https://linkedapi.io/docs/action-st-search-companies/ st.searchCompanies Action Documentation}
   *
   * @example
   * ```typescript
   * const companySearchWorkflow = await linkedapi.searchCompanies({
   *   term: "software development",
   *   filter: {
   *     locations: ["San Francisco", "New York"],
   *     industries: ["Technology", "Software"],
   *     sizes: ["51-200", "201-500"]
   *   },
   *   limit: 25
   * });
   *
   * const companiesResult = await companySearchWorkflow.result();
   * if (companiesResult.data) {
   *   console.log("Found companies:", companiesResult.data.length);
   * }
   * ```
   */
  public async searchCompanies(
    params: TSearchCompanyParams,
  ): Promise<WorkflowHandler<TSearchCompanyResult[]>> {
    const searchCompaniesMapper = new SearchCompaniesMapper();
    const workflowDefinition = searchCompaniesMapper.mapRequest(params);
    const { workflowId } =
      await this.workflowExecutor.startWorkflow(workflowDefinition);
    return new WorkflowHandler<TSearchCompanyResult[]>(
      workflowId,
      "searchCompanies" as const,
      this.workflowExecutor,
      searchCompaniesMapper,
    );
  }

  /**
   * Search for companies on LinkedIn using Sales Navigator.
   *
   * This method performs a company search using Sales Navigator's advanced search capabilities.
   * Sales Navigator provides more detailed filtering options and enhanced company data.
   *
   * @param params - Sales Navigator search parameters with advanced filtering options
   * @returns Promise resolving to a WorkflowHandler containing an array of Sales Navigator company results
   *
   * @see {@link https://linkedapi.io/docs/action-nv-search-companies/ nv.searchCompanies Action Documentation}
   *
   * @example
   * ```typescript
   * const nvCompanySearchWorkflow = await linkedapi.salesNavigatorSearchCompanies({
   *   term: "fintech startup",
   *   filter: {
   *     locations: ["United States"],
   *     industries: ["Financial Services"],
   *     sizes: ["11-50"],
   *     annualRevenue: {
   *       min: "0",
   *       max: "2.5"
   *     }
   *   },
   *   limit: 50
   * });
   *
   * const companiesResult = await nvCompanySearchWorkflow.result();
   * if (companiesResult.data) {
   *   console.log("Sales Navigator companies:", companiesResult.data.length);
   * }
   * ```
   */
  public async salesNavigatorSearchCompanies(
    params: TNvSearchCompanyParams,
  ): Promise<WorkflowHandler<TNvSearchCompanyResult[]>> {
    const salesNavigatorSearchCompaniesMapper = new NvSearchCompaniesMapper();
    const workflowDefinition =
      salesNavigatorSearchCompaniesMapper.mapRequest(params);
    const { workflowId } =
      await this.workflowExecutor.startWorkflow(workflowDefinition);
    return new WorkflowHandler<TNvSearchCompanyResult[]>(
      workflowId,
      "salesNavigatorSearchCompanies" as const,
      this.workflowExecutor,
      salesNavigatorSearchCompaniesMapper,
    );
  }

  /**
   * Search for people on LinkedIn using standard search.
   *
   * This method performs a people search on LinkedIn using the standard search interface.
   * You can filter by keywords, location, current company, past company, industry, and more.
   *
   * @param params - Search parameters including keywords, filters, and pagination options
   * @returns Promise resolving to a WorkflowHandler containing an array of people search results
   *
   * @see {@link https://linkedapi.io/docs/action-st-search-people/ st.searchPeople Action Documentation}
   *
   * @example
   * ```typescript
   * const peopleSearchWorkflow = await linkedapi.searchPeople({
   *   term: "software engineer React",
   *   filter: {
   *     locations: ["San Francisco Bay Area"],
   *     currentCompanies: ["Google", "Facebook", "Apple"],
   *     industries: ["Technology"]
   *   },
   *   limit: 50
   * });
   *
   * const peopleResult = await peopleSearchWorkflow.result();
   * if (peopleResult.data) {
   *   console.log("Found professionals:", peopleResult.data.length);
   * }
   * ```
   */
  public async searchPeople(
    params: TSearchPeopleParams,
  ): Promise<WorkflowHandler<TSearchPeopleResult[]>> {
    const searchPeopleMapper = new SearchPeopleMapper();
    const workflowDefinition = searchPeopleMapper.mapRequest(params);
    const { workflowId } =
      await this.workflowExecutor.startWorkflow(workflowDefinition);
    return new WorkflowHandler<TSearchPeopleResult[]>(
      workflowId,
      "searchPeople" as const,
      this.workflowExecutor,
      searchPeopleMapper,
    );
  }

  /**
   * Search for people on LinkedIn using Sales Navigator.
   *
   * This method performs a people search using Sales Navigator's advanced search capabilities.
   * Sales Navigator provides more sophisticated filtering options and enhanced prospect data.
   *
   * @param params - Sales Navigator search parameters with advanced filtering options
   * @returns Promise resolving to a WorkflowHandler containing an array of Sales Navigator people results
   *
   * @see {@link https://linkedapi.io/docs/action-nv-search-people/ nv.searchPeople Action Documentation}
   *
   * @example
   * ```typescript
   * const nvPeopleSearchWorkflow = await linkedapi.salesNavigatorSearchPeople({
   *   term: "VP Marketing B2B SaaS",
   *   filter: {
   *     locations: ["United States"],
   *     currentCompanies: ["Salesforce", "HubSpot"],
   *     position: "VP"
   *   },
   *   limit: 25
   * });
   *
   * const prospectsResult = await nvPeopleSearchWorkflow.result();
   * if (prospectsResult.data) {
   *   console.log("Sales Navigator prospects:", prospectsResult.data.length);
   * }
   * ```
   */
  public async salesNavigatorSearchPeople(
    params: TNvSearchPeopleParams,
  ): Promise<WorkflowHandler<TNvSearchPeopleResult[]>> {
    const salesNavigatorSearchPeopleMapper = new NvSearchPeopleMapper();
    const workflowDefinition =
      salesNavigatorSearchPeopleMapper.mapRequest(params);
    const { workflowId } =
      await this.workflowExecutor.startWorkflow(workflowDefinition);
    return new WorkflowHandler<TNvSearchPeopleResult[]>(
      workflowId,
      "salesNavigatorSearchPeople" as const,
      this.workflowExecutor,
      salesNavigatorSearchPeopleMapper,
    );
  }

  /**
   * Send a connection request to a LinkedIn user.
   *
   * This method sends a connection request to the specified person with an optional personalized message.
   * The request will appear in the recipient's connection requests section.
   *
   * @param params - Parameters including the person's URL and optional connection message
   * @returns Promise resolving to a WorkflowHandler for the connection request action
   *
   * @see {@link https://linkedapi.io/docs/working-with-connection-requests/ Working with Connection Requests Documentation}
   * @see {@link https://linkedapi.io/docs/action-st-send-connection-request/ st.sendConnectionRequest Action Documentation}
   *
   * @example
   * ```typescript
   * const connectionWorkflow = await linkedapi.sendConnectionRequest({
   *   personUrl: "https://www.linkedin.com/in/john-doe",
   *   note: "Hi John, I'd love to connect and discuss opportunities in tech!"
   * });
   *
   * await connectionWorkflow.result();
   * console.log("Connection request sent successfully");
   * ```
   */
  public async sendConnectionRequest(
    params: TSendConnectionRequestParams,
  ): Promise<WorkflowHandler<void>> {
    const sendConnectionRequestMapper =
      new VoidWorkflowMapper<TSendConnectionRequestParams>(
        "st.sendConnectionRequest",
      );
    const workflowDefinition = sendConnectionRequestMapper.mapRequest(params);
    const { workflowId } =
      await this.workflowExecutor.startWorkflow(workflowDefinition);
    return new WorkflowHandler<void>(
      workflowId,
      "sendConnectionRequest" as const,
      this.workflowExecutor,
      sendConnectionRequestMapper,
    );
  }

  /**
   * Check the connection status with a specific LinkedIn user.
   *
   * This method checks whether you are connected with a person, have a pending request,
   * or have no connection with them.
   *
   * @param params - Parameters including the person's URL
   * @returns Promise resolving to a WorkflowHandler containing the connection status result
   *
   * @see {@link https://linkedapi.io/docs/checking-connection-status/ Checking Connection Status Documentation}
   * @see {@link https://linkedapi.io/docs/action-st-check-connection-status/ st.checkConnectionStatus Action Documentation}
   *
   * @example
   * ```typescript
   * const statusWorkflow = await linkedapi.checkConnectionStatus({
   *   personUrl: "https://www.linkedin.com/in/john-doe"
   * });
   *
   * const statusResult = await statusWorkflow.result();
   * if (statusResult.data) {
   *   console.log("Connection status:", statusResult.data.connectionStatus);
   * }
   * ```
   */
  public async checkConnectionStatus(
    params: TCheckConnectionStatusParams,
  ): Promise<WorkflowHandler<TCheckConnectionStatusResult>> {
    const checkConnectionStatusMapper = new SimpleWorkflowMapper<
      TCheckConnectionStatusParams,
      TCheckConnectionStatusResult
    >({
      actionType: "st.checkConnectionStatus",
    });
    const workflowDefinition = checkConnectionStatusMapper.mapRequest(params);
    const { workflowId } =
      await this.workflowExecutor.startWorkflow(workflowDefinition);
    return new WorkflowHandler<TCheckConnectionStatusResult>(
      workflowId,
      "checkConnectionStatus" as const,
      this.workflowExecutor,
      checkConnectionStatusMapper,
    );
  }

  /**
   * Withdraw a previously sent connection request.
   *
   * This method withdraws a connection request that was previously sent to a person.
   * The request will be removed from their pending connection requests.
   *
   * @param params - Parameters including the person's URL
   * @returns Promise resolving to a WorkflowHandler for the withdrawal action
   *
   * @see {@link https://linkedapi.io/docs/working-with-connection-requests/ Working with Connection Requests Documentation}
   * @see {@link https://linkedapi.io/docs/action-st-withdraw-connection-request/ st.withdrawConnectionRequest Action Documentation}
   *
   * @example
   * ```typescript
   * const withdrawWorkflow = await linkedapi.withdrawConnectionRequest({
   *   personUrl: "https://www.linkedin.com/in/john-doe"
   * });
   *
   * await withdrawWorkflow.result();
   * console.log("Connection request withdrawn successfully");
   * ```
   */
  public async withdrawConnectionRequest(
    params: TWithdrawConnectionRequestParams,
  ): Promise<WorkflowHandler<void>> {
    const withdrawConnectionRequestMapper =
      new VoidWorkflowMapper<TWithdrawConnectionRequestParams>(
        "st.withdrawConnectionRequest",
      );
    const workflowDefinition =
      withdrawConnectionRequestMapper.mapRequest(params);
    const { workflowId } =
      await this.workflowExecutor.startWorkflow(workflowDefinition);
    return new WorkflowHandler<void>(
      workflowId,
      "withdrawConnectionRequest" as const,
      this.workflowExecutor,
      withdrawConnectionRequestMapper,
    );
  }

  /**
   * Retrieve all pending connection requests you have received.
   *
   * This method fetches a list of all pending connection requests that others have sent to you.
   * You can optionally filter the results by label.
   *
   * @returns Promise resolving to a WorkflowHandler containing an array of pending requests
   *
   * @see {@link https://linkedapi.io/docs/working-with-connection-requests/ Working with Connection Requests Documentation}
   * @see {@link https://linkedapi.io/docs/action-st-retrieve-pending-requests/ st.retrievePendingRequests Action Documentation}
   *
   * @example
   * ```typescript
   * const pendingWorkflow = await linkedapi.retrievePendingRequests();
   *
   * const pendingResult = await pendingWorkflow.result();
   * if (pendingResult.data) {
   *   console.log("Pending requests:", pendingResult.data.length);
   *
   * pendingResult.data.forEach(request => {
   *   console.log(`${request.name}: ${request.headline}`);
   *   console.log(`Profile: ${request.publicUrl}`);
   * });
   * }
   * ```
   */
  public async retrievePendingRequests(): Promise<
    WorkflowHandler<TRetrievePendingRequestsResult[]>
  > {
    const retrievePendingRequestsMapper = new RetrievePendingRequestsMapper();
    const workflowDefinition = retrievePendingRequestsMapper.mapRequest({});
    const { workflowId } =
      await this.workflowExecutor.startWorkflow(workflowDefinition);
    return new WorkflowHandler<TRetrievePendingRequestsResult[]>(
      workflowId,
      "retrievePendingRequests" as const,
      this.workflowExecutor,
      retrievePendingRequestsMapper,
    );
  }

  /**
   * Retrieve your LinkedIn connections with optional filtering.
   *
   * This method fetches a list of your LinkedIn connections. You can filter by various criteria
   * like name, position, location, industry, company, and school.
   *
   * @param params - Parameters including optional filters and pagination options
   * @returns Promise resolving to a WorkflowHandler containing an array of connections
   *
   * @see {@link https://linkedapi.io/docs/managing-existing-connections/ Managing Existing Connections Documentation}
   * @see {@link https://linkedapi.io/docs/action-st-retrieve-connections/ st.retrieveConnections Action Documentation}
   *
   * @example
   * ```typescript
   * const connectionsWorkflow = await linkedapi.retrieveConnections({
   *   filter: {
   *     firstName: "John",
   *     industries: ["Technology", "Software"],
   *     locations: ["San Francisco Bay Area"],
   *     currentCompanies: ["Google", "Microsoft"]
   *   },
   *   limit: 50
   * });
   *
   * const connectionsResult = await connectionsWorkflow.result();
   * if (connectionsResult.data) {
   *   console.log("Filtered connections:", connectionsResult.data.length);
   * }
   * ```
   */
  public async retrieveConnections(
    params: TRetrieveConnectionsParams = {},
  ): Promise<WorkflowHandler<TRetrieveConnectionsResult[]>> {
    const retrieveConnectionsMapper = new RetrieveConnectionsMapper();
    const workflowDefinition = retrieveConnectionsMapper.mapRequest(params);
    const { workflowId } =
      await this.workflowExecutor.startWorkflow(workflowDefinition);
    return new WorkflowHandler<TRetrieveConnectionsResult[]>(
      workflowId,
      "retrieveConnections" as const,
      this.workflowExecutor,
      retrieveConnectionsMapper,
    );
  }

  /**
   * Remove an existing connection from your LinkedIn network.
   *
   * This method removes a connection from your LinkedIn network. The person will no longer
   * be in your connections list and you will lose the connection relationship.
   *
   * @param params - Parameters including the person's URL
   * @returns Promise resolving to a WorkflowHandler for the removal action
   *
   * @see {@link https://linkedapi.io/docs/managing-existing-connections/ Managing Existing Connections Documentation}
   * @see {@link https://linkedapi.io/docs/action-st-remove-connection/ st.removeConnection Action Documentation}
   *
   * @example
   * ```typescript
   * const removeWorkflow = await linkedapi.removeConnection({
   *   personUrl: "https://www.linkedin.com/in/john-doe"
   * });
   *
   * await removeWorkflow.result();
   * console.log("Connection removed successfully");
   * ```
   */
  public async removeConnection(
    params: TRemoveConnectionParams,
  ): Promise<WorkflowHandler<void>> {
    const removeConnectionMapper =
      new VoidWorkflowMapper<TRemoveConnectionParams>("st.removeConnection");
    const workflowDefinition = removeConnectionMapper.mapRequest(params);
    const { workflowId } =
      await this.workflowExecutor.startWorkflow(workflowDefinition);
    return new WorkflowHandler<void>(
      workflowId,
      "removeConnection" as const,
      this.workflowExecutor,
      removeConnectionMapper,
    );
  }

  /**
   * React to a LinkedIn post with an emoji reaction.
   *
   * This method adds a reaction (like, love, celebrate, support, funny, insightful) to a LinkedIn post.
   * You can only have one reaction per post, and adding a new reaction will replace any existing one.
   *
   * @param params - Parameters including the post URL and reaction type
   * @returns Promise resolving to a WorkflowHandler for the reaction action
   *
   * @see {@link https://linkedapi.io/docs/reacting-and-commenting/ Reacting and Commenting Documentation}
   * @see {@link https://linkedapi.io/docs/action-st-react-to-post/ st.reactToPost Action Documentation}
   *
   * @example
   * ```typescript
   * const reactionWorkflow = await linkedapi.reactToPost({
   *   postUrl: "https://www.linkedin.com/posts/john-doe_activity-123456789",
   *   type: "like"
   * });
   *
   * await reactionWorkflow.result();
   * console.log("Post reaction added successfully");
   * ```
   */
  public async reactToPost(
    params: TReactToPostParams,
  ): Promise<WorkflowHandler<void>> {
    const reactToPostMapper = new VoidWorkflowMapper<TReactToPostParams>(
      "st.reactToPost",
    );
    const workflowDefinition = reactToPostMapper.mapRequest(params);
    const { workflowId } =
      await this.workflowExecutor.startWorkflow(workflowDefinition);
    return new WorkflowHandler<void>(
      workflowId,
      "reactToPost" as const,
      this.workflowExecutor,
      reactToPostMapper,
    );
  }

  /**
   * Comment on a LinkedIn post.
   *
   * This method adds a text comment to a LinkedIn post. The comment will be visible to other users
   * and can help increase engagement with the post.
   *
   * @param params - Parameters including the post URL and comment text
   * @returns Promise resolving to a WorkflowHandler for the comment action
   *
   * @see {@link https://linkedapi.io/docs/reacting-and-commenting/ Reacting and Commenting Documentation}
   * @see {@link https://linkedapi.io/docs/action-st-comment-on-post/ st.commentOnPost Action Documentation}
   *
   * @example
   * ```typescript
   * const commentWorkflow = await linkedapi.commentOnPost({
   *   postUrl: "https://www.linkedin.com/posts/john-doe_activity-123456789",
   *   text: "Great insights! Thanks for sharing this valuable information."
   * });
   *
   * await commentWorkflow.result();
   * console.log("Comment posted successfully");
   * ```
   */
  public async commentOnPost(
    params: TCommentOnPostParams,
  ): Promise<WorkflowHandler<void>> {
    const commentOnPostMapper = new VoidWorkflowMapper<TCommentOnPostParams>(
      "st.commentOnPost",
    );
    const workflowDefinition = commentOnPostMapper.mapRequest(params);
    const { workflowId } =
      await this.workflowExecutor.startWorkflow(workflowDefinition);
    return new WorkflowHandler<void>(
      workflowId,
      "commentOnPost" as const,
      this.workflowExecutor,
      commentOnPostMapper,
    );
  }

  /**
   * Retrieve your LinkedIn Social Selling Index (SSI) score.
   *
   * This method fetches your current SSI score and rankings. The SSI score measures your social selling
   * performance across four key areas: establishing professional brand, finding right people,
   * engaging with insights, and building strong relationships.
   *
   * @returns Promise resolving to a WorkflowHandler containing SSI data
   *
   * @see {@link https://linkedapi.io/docs/retrieving-ssi-and-performance/ Retrieving SSI and Performance Documentation}
   * @see {@link https://linkedapi.io/docs/action-st-retrieve-ssi/ st.retrieveSSI Action Documentation}
   *
   * @example
   * ```typescript
   * const ssiWorkflow = await linkedapi.retrieveSSI();
   *
   * const ssiResult = await ssiWorkflow.result();
   * if (ssiResult.data) {
   *   console.log("SSI Score:", ssiResult.data.ssi);
   *   console.log("Industry Ranking:", ssiResult.data.industryTop);
   *   console.log("Network Ranking:", ssiResult.data.networkTop);
   * }
   * ```
   */
  public async retrieveSSI(): Promise<WorkflowHandler<TRetrieveSSIResult>> {
    const retrieveSSIMapper = new SimpleWorkflowMapper<
      TBaseActionParams,
      TRetrieveSSIResult
    >({
      actionType: "st.retrieveSSI",
    });
    const workflowDefinition = retrieveSSIMapper.mapRequest({});
    const { workflowId } =
      await this.workflowExecutor.startWorkflow(workflowDefinition);
    return new WorkflowHandler<TRetrieveSSIResult>(
      workflowId,
      "retrieveSSI" as const,
      this.workflowExecutor,
      retrieveSSIMapper,
    );
  }

  /**
   * Retrieve your LinkedIn performance and analytics data.
   *
   * This method fetches your LinkedIn performance metrics including profile views,
   * search appearances, post impressions, and other engagement statistics.
   *
   * @returns Promise resolving to a WorkflowHandler containing performance data
   *
   * @see {@link https://linkedapi.io/docs/retrieving-ssi-and-performance/ Retrieving SSI and Performance Documentation}
   * @see {@link https://linkedapi.io/docs/action-st-retrieve-performance/ st.retrievePerformance Action Documentation}
   *
   * @example
   * ```typescript
   * const performanceWorkflow = await linkedapi.retrievePerformance();
   *
   * const performanceResult = await performanceWorkflow.result();
   * if (performanceResult.data) {
   *   console.log("Profile views:", performanceResult.data.profileViews);
   *   console.log("Search appearances:", performanceResult.data.searchAppearances);
   *   console.log("Post impressions:", performanceResult.data.postImpressions);
   * }
   * ```
   */
  public async retrievePerformance(): Promise<
    WorkflowHandler<TRetrievePerformanceResult>
  > {
    const retrievePerformanceMapper = new SimpleWorkflowMapper<
      TBaseActionParams,
      TRetrievePerformanceResult
    >({
      actionType: "st.retrievePerformance",
    });
    const workflowDefinition = retrievePerformanceMapper.mapRequest({});
    const { workflowId } =
      await this.workflowExecutor.startWorkflow(workflowDefinition);
    return new WorkflowHandler<TRetrievePerformanceResult>(
      workflowId,
      "retrievePerformance" as const,
      this.workflowExecutor,
      retrievePerformanceMapper,
    );
  }

  /**
   * Retrieve Linked API usage statistics for a specific time period.
   *
   * This method fetches statistics about all actions executed during the specified period.
   * Use this information to monitor your LinkedIn automation usage and stay within limits.
   * The difference between start and end timestamps must not exceed 30 days.
   *
   * @param params - Parameters including start and end timestamps (ISO format)
   * @returns Promise resolving to API usage statistics response
   *
   * @see {@link https://linkedapi.io/docs/api-usage-statistics/ API Usage Statistics Documentation}
   *
   * @example
   * ```typescript
   * // Get usage statistics for the last 7 days
   * const endDate = new Date();
   * const startDate = new Date(endDate.getTime() - 7 * 24 * 60 * 60 * 1000);
   *
   * const statsResponse = await linkedapi.getApiUsageStats({
   *   start: startDate.toISOString(),
   *   end: endDate.toISOString()
   * });
   *
   * if (statsResponse.success) {
   *   console.log("Total actions executed:", statsResponse.result?.length);
   *
   *   statsResponse.result?.forEach(action => {
   *     console.log(`${action.actionType}: ${action.success ? 'SUCCESS' : 'FAILED'} at ${action.time}`);
   *   });
   * } else {
   *   console.error("Failed to retrieve stats:", statsResponse.error?.message);
   * }
   * ```
   */
  public async getApiUsageStats(
    params: TApiUsageStatsParams,
  ): Promise<TApiUsageStatsResponse> {
    const queryParams = new URLSearchParams({
      start: params.start,
      end: params.end,
    });

    const response = await this.httpClient.get<TApiUsageAction[]>(
      `/stats/actions?${queryParams.toString()}`,
    );

    return {
      success: response.success,
      result: response.result,
      error: response.error,
    };
  }
}

export default LinkedApi;

export { LinkedApi, WorkflowHandler };

export type {
  TLinkedApiConfig,
  TLinkedApiResponse,
  TWorkflowDefinition,
  TWorkflowResponse,
  TMappedResponse,
};

export * from "./types";
export * from "./core/workflow-restoration";
