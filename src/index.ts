import { Operation } from './core';
import { buildLinkedApiHttpClient } from './core/linked-api-http-client';
import type { TMappedResponse } from './mappers/base-mapper.abstract';
import {
  AcceptInvitation,
  CheckConnectionStatus,
  CommentOnPost,
  CreatePost,
  CreateRepost,
  CustomWorkflow,
  FetchCompany,
  FetchJob,
  FetchPerson,
  FetchPost,
  IgnoreInvitation,
  ManageConversation,
  NvFetchCompany,
  NvFetchPerson,
  NvManageConversation,
  NvSearchCompanies,
  NvSearchPeople,
  NvSendMessage,
  NvSyncConversation,
  NvSyncInbox,
  ReactToComment,
  ReactToPost,
  RemoveConnection,
  ReplyToComment,
  RetrieveConnections,
  RetrieveFeed,
  RetrieveInvitations,
  RetrievePendingRequests,
  RetrievePerformance,
  RetrieveProfileViewers,
  RetrieveSSI,
  SearchCompanies,
  SearchJobs,
  SearchPeople,
  SearchPosts,
  SendConnectionRequest,
  SendMessage,
  SyncConversation,
  SyncInbox,
  SyncNetwork,
  WithdrawConnectionRequest,
} from './operations';
import {
  HttpClient,
  LinkedApiError,
  TAccountInfo,
  TApiUsageAction,
  TApiUsageParams,
  TConversationPollRequest,
  TConversationPollResult,
  TInboxPollRequest,
  TInboxPollResult,
  TLinkedApiActionErrorType,
  TLinkedApiErrorType,
  TNetworkPollRequest,
  TNetworkPollResult,
} from './types';
import type { TLinkedApiConfig } from './types/config';
import type { TLinkedApiResponse } from './types/responses';
import type { TWorkflowDefinition, TWorkflowResponse } from './types/workflows';

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

  /**
   * Initialize LinkedApi client with your API tokens.
   *
   * @param config - Configuration object containing API tokens and optional settings
   * @returns LinkedApi instance with access to LinkedIn automation features
   */
  public constructor(config: TLinkedApiConfig | HttpClient) {
    if (config instanceof HttpClient) {
      this.httpClient = config;
    } else {
      this.httpClient = buildLinkedApiHttpClient(config, config.client ?? 'node', config.baseUrl);
    }

    this.customWorkflow = new CustomWorkflow(this.httpClient);
    this.sendMessage = new SendMessage(this.httpClient);
    this.syncConversation = new SyncConversation(this.httpClient);
    this.syncInbox = new SyncInbox(this.httpClient);
    this.syncNetwork = new SyncNetwork(this.httpClient);
    this.manageConversation = new ManageConversation(this.httpClient);
    this.checkConnectionStatus = new CheckConnectionStatus(this.httpClient);
    this.sendConnectionRequest = new SendConnectionRequest(this.httpClient);
    this.withdrawConnectionRequest = new WithdrawConnectionRequest(this.httpClient);
    this.retrievePendingRequests = new RetrievePendingRequests(this.httpClient);
    this.retrieveInvitations = new RetrieveInvitations(this.httpClient);
    this.retrieveProfileViewers = new RetrieveProfileViewers(this.httpClient);
    this.acceptInvitation = new AcceptInvitation(this.httpClient);
    this.ignoreInvitation = new IgnoreInvitation(this.httpClient);
    this.retrieveConnections = new RetrieveConnections(this.httpClient);
    this.removeConnection = new RemoveConnection(this.httpClient);
    this.searchCompanies = new SearchCompanies(this.httpClient);
    this.searchPeople = new SearchPeople(this.httpClient);
    this.searchJobs = new SearchJobs(this.httpClient);
    this.searchPosts = new SearchPosts(this.httpClient);
    this.fetchCompany = new FetchCompany(this.httpClient);
    this.fetchPerson = new FetchPerson(this.httpClient);
    this.fetchPost = new FetchPost(this.httpClient);
    this.fetchJob = new FetchJob(this.httpClient);
    this.reactToPost = new ReactToPost(this.httpClient);
    this.commentOnPost = new CommentOnPost(this.httpClient);
    this.reactToComment = new ReactToComment(this.httpClient);
    this.replyToComment = new ReplyToComment(this.httpClient);
    this.createPost = new CreatePost(this.httpClient);
    this.createRepost = new CreateRepost(this.httpClient);
    this.retrieveFeed = new RetrieveFeed(this.httpClient);
    this.retrieveSSI = new RetrieveSSI(this.httpClient);
    this.retrievePerformance = new RetrievePerformance(this.httpClient);
    this.nvSendMessage = new NvSendMessage(this.httpClient);
    this.nvSyncConversation = new NvSyncConversation(this.httpClient);
    this.nvSyncInbox = new NvSyncInbox(this.httpClient);
    this.nvManageConversation = new NvManageConversation(this.httpClient);
    this.nvSearchCompanies = new NvSearchCompanies(this.httpClient);
    this.nvSearchPeople = new NvSearchPeople(this.httpClient);
    this.nvFetchCompany = new NvFetchCompany(this.httpClient);
    this.nvFetchPerson = new NvFetchPerson(this.httpClient);

    this.operations = [
      this.customWorkflow,
      this.sendMessage,
      this.syncConversation,
      this.syncInbox,
      this.syncNetwork,
      this.manageConversation,
      this.checkConnectionStatus,
      this.sendConnectionRequest,
      this.withdrawConnectionRequest,
      this.retrievePendingRequests,
      this.retrieveInvitations,
      this.retrieveProfileViewers,
      this.acceptInvitation,
      this.ignoreInvitation,
      this.retrieveConnections,
      this.removeConnection,
      this.searchCompanies,
      this.searchPeople,
      this.searchJobs,
      this.searchPosts,
      this.fetchCompany,
      this.fetchPerson,
      this.fetchPost,
      this.fetchJob,
      this.reactToPost,
      this.commentOnPost,
      this.reactToComment,
      this.replyToComment,
      this.createPost,
      this.createRepost,
      this.retrieveFeed,
      this.retrieveSSI,
      this.retrievePerformance,
      this.nvSendMessage,
      this.nvSyncConversation,
      this.nvSyncInbox,
      this.nvManageConversation,
      this.nvSearchCompanies,
      this.nvSearchPeople,
      this.nvFetchCompany,
      this.nvFetchPerson,
    ];
  }

  public operations: Operation<unknown, unknown>[];

  /**
   * Execute a custom workflow with raw workflow definition.
   *
   * This method allows you to execute any custom workflow by providing a raw workflow definition.
   * Use this for advanced use cases when you need to create custom action sequences.
   *
   * @param params - The workflow definition containing action types and parameters
   * @returns Promise resolving to a WorkflowCompletion for managing the workflow execution
   *
   * @see {@link https://linkedapi.io/docs/ Linked API Documentation}
   * @see {@link https://linkedapi.io/docs/executing-workflows/ Executing Workflows Documentation}
   * @see {@link https://linkedapi.io/docs/building-workflows/ Building Workflows Documentation}
   * @see {@link https://linkedapi.io/docs/actions-overview/ Actions Overview Documentation}
   *
   * @example
   * ```typescript
   * const workflow = await linkedapi.customWorkflow.execute({
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
   * const result = await linkedapi.customWorkflow.result(workflow.workflowId);
   * ```
   */
  public customWorkflow: CustomWorkflow;

  /**
   * Send a message to a LinkedIn user via standard LinkedIn messaging.
   *
   * This method sends a direct message to a person on LinkedIn. The recipient must be a connection
   * or allow messages from anyone. This uses the standard LinkedIn messaging interface.
   *
   * @param params - Parameters including the person's URL and message text
   * @returns Promise resolving to the message sending action
   *
   * @see {@link https://linkedapi.io/docs/sending-message/ Sending Messages Documentation}
   * @see {@link https://linkedapi.io/docs/action-st-send-message/ st.sendMessage Action Documentation}
   *
   * @example
   * ```typescript
   * const workflow = await linkedapi.sendMessage.execute({
   *   personUrl: "https://www.linkedin.com/in/john-doe",
   *   text: "Hi John! I saw your recent post about AI and would love to discuss further."
   * });
   *
   * await linkedapi.sendMessage.result(workflow.workflowId);
   * console.log("Message sent successfully");
   * ```
   */
  public sendMessage: SendMessage;

  /**
   * Sync a conversation with a LinkedIn user for standard LinkedIn messaging.
   *
   * This method synchronizes a conversation with a person, preparing it for future message polling.
   * Each conversation must be synced once before you can poll it for messages. This is a time-consuming
   * process that retrieves the conversation history and prepares it for future updates.
   *
   * Syncing lasts for a limited period: `days` (1-90, 30 by default) counted from the moment the action
   * starts running. The action returns the resulting `syncUntil` deadline, which {@link pollConversations}
   * also reports. Once it passes, the conversation stops being updated — polling keeps returning the
   * messages collected so far. Call this action again on the same person to start a new period; the
   * accumulated history is preserved.
   *
   * @param params - Parameters including the person's URL and, optionally, how many days to sync for
   * @returns Promise resolving to the sync action with the `syncUntil` deadline
   *
   * @see {@link https://linkedapi.io/docs/working-with-conversations/ Working with Conversations Documentation}
   * @see {@link https://linkedapi.io/docs/action-st-sync-conversation/ st.syncConversation Action Documentation}
   *
   * @example
   * ```typescript
   * const workflow = await linkedapi.syncConversation.execute({
   *   personUrl: "https://www.linkedin.com/in/john-doe",
   *   days: 14
   * });
   *
   * const { syncUntil } = await linkedapi.syncConversation.result(workflow.workflowId);
   * console.log(`Conversation synced, updates continue until ${syncUntil}`);
   * ```
   */
  public syncConversation: SyncConversation;

  /**
   * Enable whole-inbox monitoring for standard LinkedIn messaging.
   *
   * This method enables monitoring of your entire standard LinkedIn inbox, preparing it for future
   * message polling with {@link pollInbox}. Unlike {@link syncConversation}, it is not scoped to a single
   * person: once enabled, all conversations in the inbox are monitored. This action takes no parameters
   * and returns no data.
   *
   * @param params - No parameters are required
   * @returns Promise resolving to the sync action
   *
   * @see {@link https://linkedapi.io/docs/working-with-conversations/ Working with Conversations Documentation}
   *
   * @example
   * ```typescript
   * const workflow = await linkedapi.syncInbox.execute({});
   *
   * await linkedapi.syncInbox.result(workflow.workflowId);
   * console.log("Inbox monitoring enabled and ready for polling");
   * ```
   */
  public syncInbox: SyncInbox;

  /**
   * Enable whole-network monitoring for standard LinkedIn.
   *
   * This method enables background monitoring of your LinkedIn network, preparing it for future
   * polling with {@link pollNetwork}. Once enabled, connection activity across your network is
   * monitored: accepted connections, newly added connections, and received connection requests.
   * This action takes no parameters and returns no data.
   *
   * @param params - No parameters are required
   * @returns Promise resolving to the sync action
   *
   * @example
   * ```typescript
   * const workflow = await linkedapi.syncNetwork.execute({});
   *
   * await linkedapi.syncNetwork.result(workflow.workflowId);
   * console.log("Network monitoring enabled and ready for polling");
   * ```
   */
  public syncNetwork: SyncNetwork;

  /**
   * Manage a standard LinkedIn conversation thread.
   *
   * This method applies a management operation to a conversation thread identified by its `threadId`
   * (as returned by {@link pollInbox} or {@link pollConversations}, or read from an open conversation URL).
   * Supported operations are `archive`, `unarchive`, `star`, `unstar`, `mute`, and `unmute`. This action
   * returns no data and can fail with a `threadNotFound` error if the thread does not exist.
   *
   * @param params - Parameters including the thread id and the operation to apply
   * @returns Promise resolving to the management action
   *
   * @see {@link https://linkedapi.io/docs/working-with-conversations/ Working with Conversations Documentation}
   *
   * @example
   * ```typescript
   * const workflow = await linkedapi.manageConversation.execute({
   *   threadId: "2-Zjhm...",
   *   operation: "archive"
   * });
   *
   * await linkedapi.manageConversation.result(workflow.workflowId);
   * console.log("Conversation updated successfully");
   * ```
   */
  public manageConversation: ManageConversation;

  /**
   * Send a message to a LinkedIn user via Sales Navigator.
   *
   * This method sends a direct message to a person using Sales Navigator's messaging capabilities.
   * Sales Navigator allows messaging people who are not connections and provides enhanced messaging features.
   *
   * @param params - Parameters including the person's URL, message text, and subject line
   * @returns Promise resolving to the message sending action
   *
   * @see {@link https://linkedapi.io/docs/sending-message/ Sending Messages Documentation}
   * @see {@link https://linkedapi.io/docs/action-nv-send-message/ nv.sendMessage Action Documentation}
   *
   * @example
   * ```typescript
   * const workflow = await linkedapi.nvSendMessage.execute({
   *   personUrl: "https://www.linkedin.com/in/john-doe",
   *   text: "Hi John! I'm reaching out regarding potential collaboration opportunities.",
   *   subject: "Partnership Opportunity"
   * });
   *
   * await linkedapi.nvSendMessage.result(workflow.workflowId);
   * console.log("Sales Navigator message sent successfully");
   * ```
   */
  public nvSendMessage: NvSendMessage;

  /**
   * Sync a conversation with a LinkedIn user for Sales Navigator messaging.
   *
   * This method synchronizes a Sales Navigator conversation with a person, preparing it for future message polling.
   * Each conversation must be synced once before you can poll it for messages. This retrieves the conversation
   * history from Sales Navigator and prepares it for future updates.
   *
   * Syncing lasts for a limited period: `days` (1-90, 30 by default) counted from the moment the action
   * starts running. The action returns the resulting `syncUntil` deadline, which {@link pollConversations}
   * also reports. Once it passes, the conversation stops being updated — polling keeps returning the
   * messages collected so far. Call this action again on the same person to start a new period; the
   * accumulated history is preserved.
   *
   * @param params - Parameters including the person's URL and, optionally, how many days to sync for
   * @returns Promise resolving to the sync action with the `syncUntil` deadline
   *
   * @see {@link https://linkedapi.io/docs/working-with-conversations/ Working with Conversations Documentation}
   * @see {@link https://linkedapi.io/docs/action-nv-sync-conversation/ nv.syncConversation Action Documentation}
   *
   * @example
   * ```typescript
   * const workflow = await linkedapi.nvSyncConversation.execute({
   *   personUrl: "https://www.linkedin.com/in/john-doe",
   *   days: 14
   * });
   *
   * const { syncUntil } = await linkedapi.nvSyncConversation.result(workflow.workflowId);
   * console.log(`Sales Navigator conversation synced, updates continue until ${syncUntil}`);
   * ```
   */
  public nvSyncConversation: NvSyncConversation;

  /**
   * Enable whole-inbox monitoring for Sales Navigator messaging.
   *
   * This method enables monitoring of your entire Sales Navigator inbox, preparing it for future
   * message polling with {@link pollInbox}. Unlike {@link nvSyncConversation}, it is not scoped to a
   * single person: once enabled, all Sales Navigator conversations are monitored. This action takes no
   * parameters and returns no data. It can fail with a `noSalesNavigator` error if the account does not
   * have Sales Navigator.
   *
   * @param params - No parameters are required
   * @returns Promise resolving to the sync action
   *
   * @see {@link https://linkedapi.io/docs/working-with-conversations/ Working with Conversations Documentation}
   *
   * @example
   * ```typescript
   * const workflow = await linkedapi.nvSyncInbox.execute({});
   *
   * await linkedapi.nvSyncInbox.result(workflow.workflowId);
   * console.log("Sales Navigator inbox monitoring enabled and ready for polling");
   * ```
   */
  public nvSyncInbox: NvSyncInbox;

  /**
   * Manage a Sales Navigator conversation thread.
   *
   * This method applies a management operation to a Sales Navigator conversation thread identified by its
   * `threadId` (as returned by {@link pollInbox} or {@link pollConversations}, or read from an open
   * conversation URL). Supported operations are `archive` and `unarchive`. This action returns no data and
   * can fail with a `noSalesNavigator` error if the account does not have Sales Navigator, or a
   * `threadNotFound` error if the thread does not exist.
   *
   * @param params - Parameters including the thread id and the operation to apply
   * @returns Promise resolving to the management action
   *
   * @see {@link https://linkedapi.io/docs/working-with-conversations/ Working with Conversations Documentation}
   *
   * @example
   * ```typescript
   * const workflow = await linkedapi.nvManageConversation.execute({
   *   threadId: "2-Zjhm...",
   *   operation: "archive"
   * });
   *
   * await linkedapi.nvManageConversation.result(workflow.workflowId);
   * console.log("Sales Navigator conversation updated successfully");
   * ```
   */
  public nvManageConversation: NvManageConversation;

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
  ): Promise<TMappedResponse<TConversationPollResult[]>> {
    try {
      const response = await this.httpClient.post<TConversationPollResult[]>(
        '/conversations/poll',
        conversations,
      );
      if (response.success && response.result) {
        return {
          data: response.result,
          errors: [],
        };
      } else {
        return {
          data: undefined,
          errors: [
            {
              type: response.error?.type as TLinkedApiActionErrorType,
              message: response.error?.message ?? '',
            },
          ],
        };
      }
    } catch (error) {
      if (error instanceof LinkedApiError && (error.type as unknown) === 'conversationsNotSynced') {
        return {
          data: undefined,
          errors: [
            {
              type: error.type as TLinkedApiActionErrorType,
              message: error.message,
            },
          ],
        };
      }
      throw error;
    }
  }

  /**
   * Poll the monitored inbox to retrieve message history and new messages.
   *
   * This method reads messages from the inbox previously enabled for monitoring via {@link syncInbox}
   * and/or {@link nvSyncInbox}, using a direct HTTP request. Unlike {@link pollConversations}, it is not
   * scoped to specific person URLs: it returns messages across the whole monitored inbox, newest-first.
   * You can optionally filter by `since` timestamp, messaging `type`, and `threadId`.
   *
   * @param request - Optional filters: `since` timestamp, `type` ("st" | "nv"), and `threadId`
   * @returns Promise resolving to a response containing the inbox messages
   *
   * @see {@link https://linkedapi.io/docs/working-with-conversations/ Working with Conversations Documentation}
   *
   * @example
   * ```typescript
   * const pollResponse = await linkedapi.pollInbox({
   *   type: "st",
   *   since: "2025-01-01T00:00:00Z",
   * });
   *
   * if (pollResponse.data) {
   *   pollResponse.data.messages.forEach((message) => {
   *     console.log(`${message.sender} in ${message.threadId}: ${message.text}`);
   *   });
   * } else {
   *   console.error("Polling failed:", pollResponse.errors);
   * }
   * ```
   */
  public async pollInbox(
    request: TInboxPollRequest = {},
  ): Promise<TMappedResponse<TInboxPollResult>> {
    const response = await this.httpClient.post<TInboxPollResult>('/inbox/poll', request);
    if (response.success && response.result) {
      return {
        data: response.result,
        errors: [],
      };
    }
    return {
      data: undefined,
      errors: [
        {
          type: response.error?.type as TLinkedApiActionErrorType,
          message: response.error?.message ?? '',
        },
      ],
    };
  }

  /**
   * Poll the monitored network to retrieve connection activity events.
   *
   * This method reads network events from the network previously enabled for monitoring via
   * {@link syncNetwork}, using a direct HTTP request. It returns events across the whole monitored
   * network, newest-first. You can optionally filter by `since` timestamp and event `type`.
   *
   * @param request - Optional filters: `since` timestamp and `type`
   * @returns Promise resolving to a response containing the network events
   *
   * @example
   * ```typescript
   * const pollResponse = await linkedapi.pollNetwork({
   *   type: "connectionAccepted",
   *   since: "2025-01-01T00:00:00Z",
   * });
   *
   * if (pollResponse.data) {
   *   pollResponse.data.events.forEach((event) => {
   *     console.log(`${event.type} ${event.personUrl} at ${event.detectedAt}`);
   *   });
   * } else {
   *   console.error("Polling failed:", pollResponse.errors);
   * }
   * ```
   */
  public async pollNetwork(
    request: TNetworkPollRequest = {},
  ): Promise<TMappedResponse<TNetworkPollResult>> {
    const response = await this.httpClient.post<TNetworkPollResult>('/network/poll', request);
    if (response.success && response.result) {
      return {
        data: response.result,
        errors: [],
      };
    }
    return {
      data: undefined,
      errors: [
        {
          type: response.error?.type as TLinkedApiActionErrorType,
          message: response.error?.message ?? '',
        },
      ],
    };
  }

  /**
   * Retrieve detailed information about a LinkedIn person profile.
   *
   * This method fetches comprehensive data about a person from their LinkedIn profile,
   * including basic information, experience, education, skills, and more based on the specified parameters.
   *
   * @param params - Parameters specifying the person URL and what data to retrieve
   * @returns Promise resolving to an object containing the person's profile data
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
   * const workflow = await linkedapi.fetchPerson.execute({
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
   * const personResult = await linkedapi.fetchPerson.result(workflow.workflowId);
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
   * const workflow = await linkedapi.fetchPerson.execute({
   *   personUrl: "https://www.linkedin.com/in/john-doe"
   * });
   *
   * const basicResult = await linkedapi.fetchPerson.result(workflow.workflowId);
   * if (basicResult.data) {
   *   console.log("Basic info:", basicResult.data.name, basicResult.data.headline);
   * }
   * ```
   */
  public fetchPerson: FetchPerson;

  /**
   * Retrieve person information via Sales Navigator.
   *
   * This method opens a person's profile page in Sales Navigator and retrieves their information.
   * Sales Navigator provides enhanced data and is useful for sales prospecting activities.
   *
   * @param params - Parameters including the person's hashed URL and data options
   * @returns Promise resolving to an object containing Sales Navigator person data
   *
   * @see {@link https://linkedapi.io/docs/visiting-person-page/ Visiting Person Page Documentation}
   * @see {@link https://linkedapi.io/docs/action-nv-open-person-page/ nv.openPersonPage Action Documentation}
   *
   * @example
   * ```typescript
   * const workflow = await linkedapi.nvFetchPerson.execute({
   *   personHashedUrl: "https://www.linkedin.com/in/ABC123",
   * });
   *
   * const personResult = await linkedapi.nvFetchPerson.result(workflow.workflowId);
   * console.log("Sales Navigator data:", personResult.data);
   * ```
   */
  public nvFetchPerson: NvFetchPerson;

  /**
   * Retrieve detailed information about a LinkedIn company profile.
   *
   * This method fetches comprehensive data about a company from their LinkedIn page,
   * including basic information, employee data, posts, and more based on the specified parameters.
   *
   * @param params - Parameters specifying the company URL and what data to retrieve
   * @returns Promise resolving to an object containing the company's profile data
   *
   * @see {@link https://linkedapi.io/docs/action-st-open-company-page/ st.openCompanyPage Action Documentation}
   * @see {@link https://linkedapi.io/docs/action-st-retrieve-company-employees/ st.retrieveCompanyEmployees Child Action}
   * @see {@link https://linkedapi.io/docs/action-st-retrieve-company-dms/ st.retrieveCompanyDMs Child Action}
   * @see {@link https://linkedapi.io/docs/action-st-retrieve-company-posts/ st.retrieveCompanyPosts Child Action}
   *
   * @example
   * ```typescript
   * // Fetch company information with employees and posts (new simplified syntax)
   * const workflow = await linkedapi.fetchCompany.execute({
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
   * const companyResult = await linkedapi.fetchCompany.result(workflow.workflowId);
   * if (companyResult.data) {
   *   console.log("Company name:", companyResult.data.name);
   *   console.log("Employee count:", companyResult.data.employees?.length);
   *   console.log("Posts:", companyResult.data.posts?.length);
   * }
   * ```
   */
  public fetchCompany: FetchCompany;

  /**
   * Retrieve company information via Sales Navigator.
   *
   * This method opens a company's profile page in Sales Navigator and retrieves their information.
   * Sales Navigator provides enhanced company data and is useful for B2B sales prospecting.
   *
   * @param params - Parameters including the company's hashed URL and data options
   * @returns Promise resolving to an object containing Sales Navigator company data
   *
   * @see {@link https://linkedapi.io/docs/action-nv-open-company-page/ nv.openCompanyPage Action Documentation}
   * @see {@link https://linkedapi.io/docs/action-nv-retrieve-company-employees/ nv.retrieveCompanyEmployees Child Action}
   * @see {@link https://linkedapi.io/docs/action-nv-retrieve-company-dms/ nv.retrieveCompanyDMs Child Action}
   *
   * @example
   * ```typescript
   * // Sales Navigator company fetch (new simplified syntax)
   * const workflow = await linkedapi.nvFetchCompany.execute({
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
   * const companyResult = await linkedapi.nvFetchCompany.result(workflow.workflowId);
   * if (companyResult.data) {
   *   console.log("Company name:", companyResult.data.name);
   *   console.log("Employees:", companyResult.data.employees?.length);
   *   console.log("Decision makers:", companyResult.data.dms?.length);
   * }
   * ```
   */
  public nvFetchCompany: NvFetchCompany;

  /**
   * Retrieve detailed information about a LinkedIn post.
   *
   * This method fetches comprehensive data about a specific LinkedIn post,
   * including content, author information, engagement metrics, and comments.
   *
   * @param params - Parameters specifying the post URL
   * @returns Promise resolving to an object containing the post data
   *
   * @see {@link https://linkedapi.io/docs/action-st-open-post/ st.openPost Action Documentation}
   *
   * @example
   * ```typescript
   * const workflow = await linkedapi.fetchPost.execute({
   *   postUrl: "https://www.linkedin.com/posts/john-doe_activity-123456789"
   * });
   *
   * const result = await linkedapi.fetchPost.result(workflow.workflowId);
   * if (result.data) {
   *   console.log("Post content:", result.data.text);
   *   console.log("Author:", result.data.author);
   *   console.log("Reactions:", result.data.reactions);
   * }
   * ```
   */
  public fetchPost: FetchPost;

  /**
   * Retrieve detailed information about a LinkedIn job.
   *
   * This method fetches comprehensive data about a specific LinkedIn job,
   * including company, location, salary, description, and application details.
   *
   * @param params - Parameters specifying the job URL
   * @returns Promise resolving to an object containing the job data
   *
   * @see {@link https://linkedapi.io/docs/action-st-open-job/ st.openJob Action Documentation}
   *
   * @example
   * ```typescript
   * const workflow = await linkedapi.fetchJob.execute({
   *   jobUrl: "https://www.linkedin.com/jobs/view/4416248954/"
   * });
   *
   * const result = await linkedapi.fetchJob.result(workflow.workflowId);
   * if (result.data) {
   *   console.log("Job title:", result.data.title);
   *   console.log("Company:", result.data.companyName);
   * }
   * ```
   */
  public fetchJob: FetchJob;

  /**
   * Search for companies on LinkedIn using standard search.
   *
   * This method performs a company search on LinkedIn using the standard search interface.
   * You can filter by various criteria like location, industry, company size, and more.
   *
   * @param params - Search parameters including keywords, filters, and pagination options
   * @returns Promise resolving to an object containing an array of company search results
   *
   * @see {@link https://linkedapi.io/docs/action-st-search-companies/ st.searchCompanies Action Documentation}
   *
   * @example
   * ```typescript
   * const workflow = await linkedapi.searchCompanies.execute({
   *   term: "software development",
   *   filter: {
   *     locations: ["San Francisco", "New York"],
   *     industries: ["Technology", "Software"],
   *     sizes: ["51-200", "201-500"]
   *   },
   *   limit: 25
   * });
   *
   * const companiesResult = await linkedapi.searchCompanies.result(workflow.workflowId);
   * if (companiesResult.data) {
   *   console.log("Found companies:", companiesResult.data.length);
   * }
   * ```
   */
  public searchCompanies: SearchCompanies;

  /**
   * Search for companies on LinkedIn using Sales Navigator.
   *
   * This method performs a company search using Sales Navigator's advanced search capabilities.
   * Sales Navigator provides more detailed filtering options and enhanced company data.
   *
   * @param params - Sales Navigator search parameters with advanced filtering options
   * @returns Promise resolving to an object containing an array of Sales Navigator company results
   *
   * @see {@link https://linkedapi.io/docs/action-nv-search-companies/ nv.searchCompanies Action Documentation}
   *
   * @example
   * ```typescript
   * const workflow = await linkedapi.nvSearchCompanies.execute({
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
   * const companiesResult = await linkedapi.nvSearchCompanies.result(workflow.workflowId);
   * if (companiesResult.data) {
   *   console.log("Sales Navigator companies:", companiesResult.data.length);
   * }
   * ```
   */
  public nvSearchCompanies: NvSearchCompanies;

  /**
   * Search for people on LinkedIn using standard search.
   *
   * This method performs a people search on LinkedIn using the standard search interface.
   * You can filter by keywords, location, current company, past company, industry, and more.
   *
   * @param params - Search parameters including keywords, filters, and pagination options
   * @returns Promise resolving to an object containing an array of people search results
   *
   * @see {@link https://linkedapi.io/docs/action-st-search-people/ st.searchPeople Action Documentation}
   *
   * @example
   * ```typescript
   * const workflow = await linkedapi.searchPeople.execute({
   *   term: "software engineer React",
   *   filter: {
   *     locations: ["San Francisco Bay Area"],
   *     currentCompanies: ["Google", "Facebook", "Apple"],
   *     industries: ["Technology"]
   *   },
   *   limit: 50
   * });
   *
   * const result = await linkedapi.searchPeople.result(workflow.workflowId);
   * if (result.data) {
   *   console.log("Found professionals:", result.data.length);
   * }
   * ```
   */
  public searchPeople: SearchPeople;

  /**
   * Search for jobs on LinkedIn using standard search.
   *
   * This method performs a job search on LinkedIn using the standard search interface.
   * You can filter by location, date posted, experience level, employment type, workplace type, and more.
   *
   * LinkedIn serves either a classic or an AI-powered jobs search, and the two do not offer the
   * same refinements. Pass `filter` for the classic one or `preferences` for the AI-powered one,
   * never both.
   *
   * @param params - Search parameters including keywords, filters, and pagination options
   * @returns Promise resolving to an object containing an array of job search results
   *
   * @see {@link https://linkedapi.io/docs/action-st-search-jobs/ st.searchJobs Action Documentation}
   *
   * @example
   * ```typescript
   * const workflow = await linkedapi.searchJobs.execute({
   *   term: "product manager",
   *   location: "San Francisco, California, United States",
   *   filter: {
   *     experienceLevels: ["midSeniorLevel", "director"],
   *     workplaceTypes: ["remote", "hybrid"]
   *   },
   *   limit: 25
   * });
   *
   * const jobsResult = await linkedapi.searchJobs.result(workflow.workflowId);
   * if (jobsResult.data) {
   *   console.log("Found jobs:", jobsResult.data.length);
   * }
   * ```
   */
  public searchJobs: SearchJobs;

  /**
   * Search for posts on LinkedIn using standard search.
   *
   * This method performs a content search on LinkedIn using the standard search interface.
   * You can filter by sort order, date posted, content type, who posted, the people and companies
   * a post comes from or mentions, and the author's company or industry.
   *
   * Either `term` or `customSearchUrl` must be provided. When `customSearchUrl` is given, `filter`
   * is ignored entirely and only the facets already encoded in the URL are applied. `limit` defaults
   * to 10 and may go up to 100, or up to 20 when child actions are attached.
   *
   * The five person and company filters accept either `{ name, urn?, personHashedUrl? }` /
   * `{ name, urn?, companyHashedUrl? }` objects or a plain string as shorthand for the name alone,
   * and both forms can be mixed in one array. Supplying an identifier pins the exact entity: the
   * action fails with `filterIdentityMismatch` rather than filtering by a namesake.
   *
   * @param params - Search parameters including the term, filters, and result limit
   * @returns Promise resolving to an object containing an array of post search results
   *
   * @see {@link https://linkedapi.io/docs/action-st-search-posts/ st.searchPosts Action Documentation}
   *
   * @example
   * ```typescript
   * const workflow = await linkedapi.searchPosts.execute({
   *   term: "climate tech",
   *   limit: 20,
   *   filter: {
   *     sort: "latest",
   *     datePosted: "pastWeek",
   *     contentType: "images",
   *     postedBy: ["firstConnections", "peopleYouFollow"],
   *     fromMembers: [{ name: "Bill Gates", urn: "urn:li:member:251749025" }],
   *     fromCompanies: ["Example Company"]
   *   }
   * });
   *
   * const postsResult = await linkedapi.searchPosts.result(workflow.workflowId);
   * if (postsResult.data) {
   *   console.log("Found posts:", postsResult.data.length);
   * }
   * ```
   */
  public searchPosts: SearchPosts;

  /**
   * Search for people on LinkedIn using Sales Navigator.
   *
   * This method performs a people search using Sales Navigator's advanced search capabilities.
   * Sales Navigator provides more sophisticated filtering options and enhanced prospect data.
   *
   * @param params - Sales Navigator search parameters with advanced filtering options
   * @returns Promise resolving to an object containing an array of Sales Navigator people results
   *
   * @see {@link https://linkedapi.io/docs/action-nv-search-people/ nv.searchPeople Action Documentation}
   *
   * @example
   * ```typescript
   * const workflow = await linkedapi.nvSearchPeople.execute({
   *   term: "VP Marketing B2B SaaS",
   *   filter: {
   *     locations: ["United States"],
   *     currentCompanies: ["Salesforce", "HubSpot"],
   *     position: "VP"
   *   },
   *   limit: 25
   * });
   *
   * const result = await linkedapi.nvSearchPeople.result(workflow.workflowId);
   * if (result.data) {
   *   console.log("Sales Navigator prospects:", result.data.length);
   * }
   * ```
   */
  public nvSearchPeople: NvSearchPeople;

  /**
   * Send a connection request to a LinkedIn user.
   *
   * This method sends a connection request to the specified person with an optional personalized message.
   * The request will appear in the recipient's connection requests section.
   *
   * @param params - Parameters including the person's URL and optional connection message
   * @returns Promise resolving to the connection request action
   *
   * @see {@link https://linkedapi.io/docs/working-with-invitations/ Working with Invitations Documentation}
   * @see {@link https://linkedapi.io/docs/action-st-send-connection-request/ st.sendConnectionRequest Action Documentation}
   *
   * @example
   * ```typescript
   * const workflow = await linkedapi.sendConnectionRequest.execute({
   *   personUrl: "https://www.linkedin.com/in/john-doe",
   *   note: "Hi John, I'd love to connect and discuss opportunities in tech!"
   * });
   *
   * await linkedapi.sendConnectionRequest.result(workflow.workflowId);
   * console.log("Connection request sent successfully");
   * ```
   */
  public sendConnectionRequest: SendConnectionRequest;

  /**
   * Check the connection status with a specific LinkedIn user.
   *
   * This method checks whether you are connected with a person, have a pending request,
   * or have no connection with them.
   *
   * @param params - Parameters including the person's URL
   * @returns Promise resolving to an object containing the connection status result
   *
   * @see {@link https://linkedapi.io/docs/checking-connection-status/ Checking Connection Status Documentation}
   * @see {@link https://linkedapi.io/docs/action-st-check-connection-status/ st.checkConnectionStatus Action Documentation}
   *
   * @example
   * ```typescript
   * const workflow = await linkedapi.checkConnectionStatus.execute({
   *   personUrl: "https://www.linkedin.com/in/john-doe"
   * });
   *
   * const result = await linkedapi.checkConnectionStatus.result(workflow.workflowId);
   * if (result.data) {
   *   console.log("Connection status:", result.data.connectionStatus);
   * }
   * ```
   */
  public checkConnectionStatus: CheckConnectionStatus;

  /**
   * Withdraw a previously sent connection request.
   *
   * This method withdraws a connection request that was previously sent to a person.
   * The request will be removed from their pending connection requests.
   *
   * @param params - Parameters including the person's URL
   * @returns Promise resolving to the withdrawal action
   *
   * @see {@link https://linkedapi.io/docs/working-with-invitations/ Working with Invitations Documentation}
   * @see {@link https://linkedapi.io/docs/action-st-withdraw-connection-request/ st.withdrawConnectionRequest Action Documentation}
   *
   * @example
   * ```typescript
   * const workflow = await linkedapi.withdrawConnectionRequest.execute({
   *   personUrl: "https://www.linkedin.com/in/john-doe"
   * });
   *
   * await linkedapi.withdrawConnectionRequest.result(workflow.workflowId);
   * console.log("Connection request withdrawn successfully");
   * ```
   */
  public withdrawConnectionRequest: WithdrawConnectionRequest;

  /**
   * Retrieve all pending connection requests you have received.
   *
   * This method fetches a list of all pending connection requests that others have sent to you.
   * You can optionally filter the results by label.
   *
   * @returns Promise resolving to an object containing an array of pending requests
   *
   * @see {@link https://linkedapi.io/docs/working-with-invitations/ Working with Invitations Documentation}
   * @see {@link https://linkedapi.io/docs/action-st-retrieve-pending-requests/ st.retrievePendingRequests Action Documentation}
   *
   * @example
   * ```typescript
   * const workflow = await linkedapi.retrievePendingRequests.execute();
   *
   * const result = await linkedapi.retrievePendingRequests.result(workflow.workflowId);
   * if (result.data) {
   *   console.log("Pending requests:", result.data.length);
   *
   * result.data.forEach(request => {
   *   console.log(`${request.name}: ${request.headline}`);
   *   console.log(`Profile: ${request.publicUrl}`);
   * });
   * }
   * ```
   */
  public retrievePendingRequests: RetrievePendingRequests;

  /**
   * Retrieve incoming connection, company-follow, and newsletter-subscription invitations.
   *
   * This method fetches the list of received invitations from your invitation manager.
   *
   * @returns Promise resolving to an object containing an array of received invitations
   *
   * @see {@link https://linkedapi.io/docs/working-with-invitations/ Working with Invitations Documentation}
   * @see {@link https://linkedapi.io/docs/action-st-retrieve-invitations/ st.retrieveInvitations Action Documentation}
   *
   * @example
   * ```typescript
   * const workflow = await linkedapi.retrieveInvitations.execute();
   *
   * const result = await linkedapi.retrieveInvitations.result(workflow.workflowId);
   * if (result.data) {
   *   for (const invitation of result.data) {
   *     console.log(`${invitation.invitationType}: ${invitation.name}`);
   *     if (invitation.invitationType === "connect") {
   *       console.log(`Profile: ${invitation.publicUrl}`);
   *     } else if (invitation.invitationType === "companyFollow") {
   *       console.log(`Company: ${invitation.companyUrl}`);
   *     } else {
   *       console.log(`Newsletter: ${invitation.newsletterUrl}`);
   *     }
   *   }
   * }
   * ```
   */
  public retrieveInvitations: RetrieveInvitations;

  /**
   * Retrieve the viewers visible on the current account's LinkedIn profile analytics page.
   *
   * @param params - Optional maximum number of viewers to retrieve (1-300, default 20)
   * @returns Promise resolving to identified and anonymous profile viewers
   *
   * @see {@link https://linkedapi.io/sdks/retrieve-profile-viewers/ SDK Documentation}
   * @see {@link https://linkedapi.io/docs/action-st-retrieve-profile-viewers/ st.retrieveProfileViewers Action Documentation}
   *
   * @example
   * ```typescript
   * const workflow = await linkedapi.retrieveProfileViewers.execute({ limit: 50 });
   * const result = await linkedapi.retrieveProfileViewers.result(workflow.workflowId);
   *
   * for (const viewer of result.data ?? []) {
   *   console.log(viewer.viewerType, viewer.viewedAgo);
   * }
   * ```
   */
  public readonly retrieveProfileViewers: RetrieveProfileViewers;

  /**
   * Accept an incoming connection, company-follow, or newsletter-subscription invitation.
   *
   * @param params - Invitation type and its matching target URL
   *
   * @see {@link https://linkedapi.io/docs/working-with-invitations/ Working with Invitations Documentation}
   * @see {@link https://linkedapi.io/docs/action-st-accept-invitation/ st.acceptInvitation Action Documentation}
   *
   * @example
   * ```typescript
   * const workflow = await linkedapi.acceptInvitation.execute({
   *   invitationType: "connect",
   *   personUrl: "https://www.linkedin.com/in/john-doe",
   * });
   *
   * await linkedapi.acceptInvitation.result(workflow.workflowId);
   * ```
   */
  public acceptInvitation: AcceptInvitation;

  /**
   * Ignore an incoming connection, company-follow, or newsletter-subscription invitation.
   *
   * @param params - Invitation type and its matching target URL
   *
   * @see {@link https://linkedapi.io/docs/working-with-invitations/ Working with Invitations Documentation}
   * @see {@link https://linkedapi.io/docs/action-st-ignore-invitation/ st.ignoreInvitation Action Documentation}
   *
   * @example
   * ```typescript
   * const workflow = await linkedapi.ignoreInvitation.execute({
   *   invitationType: "newsletterSubscribe",
   *   newsletterUrl: "https://www.linkedin.com/newsletters/example-1234567890/",
   * });
   *
   * await linkedapi.ignoreInvitation.result(workflow.workflowId);
   * ```
   */
  public ignoreInvitation: IgnoreInvitation;

  /**
   * Retrieve your LinkedIn connections with optional filtering.
   *
   * This method fetches a list of your LinkedIn connections. You can filter by various criteria
   * like name, position, location, industry, company, and school. When no filter is provided,
   * you can use the `since` parameter to retrieve only connections made on or after a specific date,
   * and each result will include a `connectedAt` timestamp.
   *
   * @param params - Parameters including optional filters, since date, and pagination options
   * @returns Promise resolving to an object containing an array of connections
   *
   * @see {@link https://linkedapi.io/docs/managing-existing-connections/ Managing Existing Connections Documentation}
   * @see {@link https://linkedapi.io/docs/action-st-retrieve-connections/ st.retrieveConnections Action Documentation}
   *
   * @example
   * ```typescript
   * // Retrieve connections with filter
   * const workflow = await linkedapi.retrieveConnections.execute({
   *   filter: {
   *     firstName: "John",
   *     industries: ["Technology", "Software"],
   *     locations: ["San Francisco Bay Area"],
   *     currentCompanies: ["Google", "Microsoft"]
   *   },
   *   limit: 50
   * });
   *
   * const result = await linkedapi.retrieveConnections.result(workflow.workflowId);
   * if (result.data) {
   *   console.log("Filtered connections:", result.data.length);
   * }
   * ```
   *
   * @example
   * ```typescript
   * // Retrieve recent connections using since parameter
   * const workflow = await linkedapi.retrieveConnections.execute({
   *   since: "2025-01-01",
   *   limit: 100
   * });
   *
   * const result = await linkedapi.retrieveConnections.result(workflow.workflowId);
   * if (result.data) {
   *   result.data.forEach(c => console.log(c.name, c.connectedAt));
   * }
   * ```
   */
  public retrieveConnections: RetrieveConnections;

  /**
   * Remove an existing connection from your LinkedIn network.
   *
   * This method removes a connection from your LinkedIn network. The person will no longer
   * be in your connections list and you will lose the connection relationship.
   *
   * @param params - Parameters including the person's URL
   * @returns Promise resolving to the removal action
   *
   * @see {@link https://linkedapi.io/docs/managing-existing-connections/ Managing Existing Connections Documentation}
   * @see {@link https://linkedapi.io/docs/action-st-remove-connection/ st.removeConnection Action Documentation}
   *
   * @example
   * ```typescript
   * const workflow = await linkedapi.removeConnection.execute({
   *   personUrl: "https://www.linkedin.com/in/john-doe"
   * });
   *
   * await linkedapi.removeConnection.result(workflow.workflowId);
   * console.log("Connection removed successfully");
   * ```
   */
  public removeConnection: RemoveConnection;

  /**
   * React to a LinkedIn post with an emoji reaction.
   *
   * This method adds a reaction (like, love, celebrate, support, funny, insightful) to a LinkedIn post.
   * You can only have one reaction per post, and adding a new reaction will replace any existing one.
   *
   * @param params - Parameters including the post URL and reaction type
   * @returns Promise resolving to the reaction action
   *
   * @see {@link https://linkedapi.io/docs/reacting-and-commenting/ Reacting and Commenting Documentation}
   * @see {@link https://linkedapi.io/docs/action-st-react-to-post/ st.reactToPost Action Documentation}
   *
   * @example
   * ```typescript
   * const workflow = await linkedapi.reactToPost.execute({
   *   postUrl: "https://www.linkedin.com/posts/john-doe_activity-123456789",
   *   type: "like"
   * });
   *
   * await linkedapi.reactToPost.result(workflow.workflowId);
   * console.log("Post reaction added successfully");
   * ```
   */
  public reactToPost: ReactToPost;

  /**
   * Comment on a LinkedIn post.
   *
   * This method adds a text comment to a LinkedIn post. The comment will be visible to other users
   * and can help increase engagement with the post.
   *
   * @param params - Parameters including the post URL and comment text
   * @returns Promise resolving to the comment action
   *
   * @see {@link https://linkedapi.io/docs/reacting-and-commenting/ Reacting and Commenting Documentation}
   * @see {@link https://linkedapi.io/docs/action-st-comment-on-post/ st.commentOnPost Action Documentation}
   *
   * @example
   * ```typescript
   * const workflow = await linkedapi.commentOnPost.execute({
   *   postUrl: "https://www.linkedin.com/posts/john-doe_activity-123456789",
   *   text: "Great insights! Thanks for sharing this valuable information."
   * });
   *
   * const { data } = await linkedapi.commentOnPost.result(workflow.workflowId);
   * console.log("Comment posted:", data?.commentUrn, data?.commentUrl);
   * ```
   */
  public commentOnPost: CommentOnPost;

  /**
   * React to a LinkedIn comment with an emoji reaction.
   *
   * This method adds a reaction (like, love, celebrate, support, funny, insightful) to a specific
   * comment, identified by its comment URL (as returned by `commentOnPost` / `fetchPost` comments).
   * The reaction type defaults to `like` when omitted.
   *
   * @param params - Parameters including the comment URL and optional reaction type
   * @returns Promise resolving to the reaction action
   *
   * @see {@link https://linkedapi.io/docs/reacting-and-commenting/ Reacting and Commenting Documentation}
   * @see {@link https://linkedapi.io/docs/action-st-react-to-comment/ st.reactToComment Action Documentation}
   *
   * @example
   * ```typescript
   * const workflow = await linkedapi.reactToComment.execute({
   *   commentUrl: "https://www.linkedin.com/feed/update/urn:li:activity:123/?dashCommentUrn=urn:li:fsd_comment:(456,urn:li:activity:123)",
   *   type: "like"
   * });
   *
   * await linkedapi.reactToComment.result(workflow.workflowId);
   * console.log("Comment reaction added successfully");
   * ```
   */
  public reactToComment: ReactToComment;

  /**
   * Reply to a LinkedIn comment.
   *
   * This method posts a text reply to a specific comment, identified by its comment URL. It returns
   * the created reply's `commentUrn` and `commentUrl` so it can be tracked or acted on afterwards.
   *
   * @param params - Parameters including the comment URL and reply text
   * @returns Promise resolving to the created reply's URN and URL
   *
   * @see {@link https://linkedapi.io/docs/reacting-and-commenting/ Reacting and Commenting Documentation}
   * @see {@link https://linkedapi.io/docs/action-st-reply-to-comment/ st.replyToComment Action Documentation}
   *
   * @example
   * ```typescript
   * const workflow = await linkedapi.replyToComment.execute({
   *   commentUrl: "https://www.linkedin.com/feed/update/urn:li:activity:123/?dashCommentUrn=urn:li:fsd_comment:(456,urn:li:activity:123)",
   *   text: "Totally agree — thanks for adding this!"
   * });
   *
   * const { data } = await linkedapi.replyToComment.result(workflow.workflowId);
   * console.log("Reply posted:", data?.commentUrn, data?.commentUrl);
   * ```
   */
  public replyToComment: ReplyToComment;

  /**
   * Create a LinkedIn post on your personal profile or a company page.
   *
   * This method creates a new post on LinkedIn. Posts can include text (up to 3,000 characters),
   * mentions of people and companies, and optional media attachments (images, videos, or
   * documents). For company posts, you must have admin access to the company page.
   *
   * Each mention binds a `@[key]` placeholder in the text to one entity. `name` is required even
   * when an identifier is given, because LinkedIn resolves a mention through its own name
   * suggestions; the identifier only decides which of the offered namesakes is taken.
   *
   * @param params - Parameters including post text, optional mentions, attachments, and company URL
   * @returns Promise resolving to the created post's URL and URN
   *
   * @see {@link https://linkedapi.io/docs/action-st-create-post/ st.createPost Action Documentation}
   *
   * @example
   * ```typescript
   * // Create a simple text post
   * const workflow = await linkedapi.createPost.execute({
   *   text: "Excited to share our latest product updates!\n\n#innovation"
   * });
   *
   * const result = await linkedapi.createPost.result(workflow.workflowId);
   * if (result.data) {
   *   console.log("Post created:", result.data.postUrl);
   * }
   * ```
   *
   * @example
   * ```typescript
   * // Create a post with image attachments
   * const workflow = await linkedapi.createPost.execute({
   *   text: "Check out these amazing photos from our team event!",
   *   attachments: [
   *     { url: "https://example.com/photo1.jpg", type: "image" },
   *     { url: "https://example.com/photo2.jpg", type: "image" }
   *   ]
   * });
   *
   * const result = await linkedapi.createPost.result(workflow.workflowId);
   * console.log("Post with images created:", result.data?.postUrl);
   * ```
   *
   * @example
   * ```typescript
   * // Create a company page post with a document
   * const workflow = await linkedapi.createPost.execute({
   *   text: "Download our latest whitepaper on AI trends",
   *   companyUrl: "https://www.linkedin.com/company/acme-corp",
   *   attachments: [
   *     { url: "https://example.com/whitepaper.pdf", type: "document", name: "AI Trends 2025" }
   *   ]
   * });
   *
   * const result = await linkedapi.createPost.result(workflow.workflowId);
   * console.log("Company post created:", result.data?.postUrl);
   * ```
   */
  public createPost: CreatePost;

  /**
   * Repost a LinkedIn post, either as is or with your own commentary.
   *
   * Without `text` the post is reposted as is. With `text` your commentary (up to 3,000 characters,
   * with optional mentions) is published above it. The post is addressed by `postUrl` or `postUrn`;
   * provide one of the two.
   *
   * The returned identifiers belong to the repost itself, which is a post of your own account, not
   * to the post that was reshared. Reposting the same post twice from the same account fails with
   * `alreadyReposted`.
   *
   * @param params - Parameters including the post target and optional commentary with mentions
   * @returns Promise resolving to the repost's own URL and URN
   *
   * @see {@link https://linkedapi.io/docs/action-st-create-repost/ st.createRepost Action Documentation}
   *
   * @example
   * ```typescript
   * // Repost as is
   * const workflow = await linkedapi.createRepost.execute({
   *   postUrl: "https://www.linkedin.com/posts/username_activity-id"
   * });
   *
   * const result = await linkedapi.createRepost.result(workflow.workflowId);
   * console.log("Repost created:", result.data?.postUrl);
   * ```
   *
   * @example
   * ```typescript
   * // Repost with commentary, addressing the post by URN
   * const workflow = await linkedapi.createRepost.execute({
   *   postUrn: "urn:li:activity:1234567890123456789",
   *   text: "Worth reading, especially the part on onboarding by @[author]!",
   *   mentions: [
   *     { key: "author", name: "Example Person", urn: "urn:li:member:123456789" }
   *   ]
   * });
   *
   * const result = await linkedapi.createRepost.result(workflow.workflowId);
   * console.log("Repost created:", result.data?.postUrn);
   * ```
   */
  public createRepost: CreateRepost;

  /**
   * Retrieve your LinkedIn Social Selling Index (SSI) score.
   *
   * This method fetches your current SSI score and rankings. The SSI score measures your social selling
   * performance across four key areas: establishing professional brand, finding right people,
   * engaging with insights, and building strong relationships.
   *
   * @returns Promise resolving to an object containing SSI data
   *
   * @see {@link https://linkedapi.io/docs/retrieving-ssi-and-performance/ Retrieving SSI and Performance Documentation}
   * @see {@link https://linkedapi.io/docs/action-st-retrieve-ssi/ st.retrieveSSI Action Documentation}
   *
   * @example
   * ```typescript
   * const workflow = await linkedapi.retrieveSSI.execute();
   *
   * const result = await linkedapi.retrieveSSI.result(workflow.workflowId);
   * if (result.data) {
   *   console.log("SSI Score:", result.data.ssi);
   *   console.log("Industry Ranking:", result.data.industryTop);
   *   console.log("Network Ranking:", result.data.networkTop);
   * }
   * ```
   */
  public retrieveSSI: RetrieveSSI;

  /**
   * Retrieve your LinkedIn performance and analytics data.
   *
   * This method fetches your LinkedIn performance metrics including profile views,
   * search appearances, post impressions, and other engagement statistics.
   *
   * @returns Promise resolving to an object containing performance data
   *
   * @see {@link https://linkedapi.io/docs/retrieving-ssi-and-performance/ Retrieving SSI and Performance Documentation}
   * @see {@link https://linkedapi.io/docs/action-st-retrieve-performance/ st.retrievePerformance Action Documentation}
   *
   * @example
   * ```typescript
   * const workflow = await linkedapi.retrievePerformance.execute();
   *
   * const result = await linkedapi.retrievePerformance.result(workflow.workflowId);
   * if (result.data) {
   *   console.log("Profile views:", result.data.profileViews);
   *   console.log("Search appearances:", result.data.searchAppearances);
   *   console.log("Post impressions:", result.data.postImpressions);
   * }
   * ```
   */
  public retrievePerformance: RetrievePerformance;

  /**
   * Retrieve posts from the current account's personalized LinkedIn home feed.
   *
   * @param params - Optional maximum number of posts to retrieve (1-100, default 20)
   * @returns Promise resolving to home-feed posts and their localized feed context
   *
   * @see {@link https://linkedapi.io/docs/action-st-retrieve-feed/ st.retrieveFeed Action Documentation}
   *
   * @example
   * ```typescript
   * const workflow = await linkedapi.retrieveFeed.execute({ limit: 20 });
   * const result = await linkedapi.retrieveFeed.result(workflow.workflowId);
   *
   * for (const post of result.data ?? []) {
   *   console.log(post.url, post.feedContext);
   * }
   * ```
   */
  public readonly retrieveFeed: RetrieveFeed;

  /**
   * Retrieve basic information about the LinkedIn account associated with the current API tokens.
   *
   * This method validates the tokens and returns the account name and LinkedIn profile URL.
   * Use this to verify credentials or display account information.
   *
   * @returns Promise resolving to account info (name and url)
   *
   * @example
   * ```typescript
   * const accountInfo = await linkedapi.getAccountInfo();
   * console.log("Account:", accountInfo.data?.name);
   * console.log("URL:", accountInfo.data?.url);
   * ```
   */
  public async getAccountInfo(): Promise<TMappedResponse<TAccountInfo>> {
    const response = await this.httpClient.get<TAccountInfo>('/account');
    if (response.success && response.result) {
      return {
        data: response.result,
        errors: [],
      };
    }
    throw new LinkedApiError(
      response.error?.type as TLinkedApiErrorType,
      response.error?.message ?? '',
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
  public async getApiUsage(params: TApiUsageParams): Promise<TMappedResponse<TApiUsageAction[]>> {
    const queryParams = new URLSearchParams({
      start: params.start,
      end: params.end,
    });

    const response = await this.httpClient.get<TApiUsageAction[]>(
      `/stats/actions?${queryParams.toString()}`,
    );

    if (response.success && response.result) {
      return {
        data: response.result,
        errors: [],
      };
    }
    throw new LinkedApiError(
      response.error?.type as TLinkedApiErrorType,
      response.error?.message ?? '',
    );
  }
}

export default LinkedApi;

export { LinkedApi, Operation as PredefinedOperation };
export { LinkedApiAdmin } from './admin';

export type {
  TLinkedApiConfig,
  TLinkedApiResponse,
  TWorkflowDefinition,
  TWorkflowResponse,
  TMappedResponse,
};

export * from './types';
export * from './operations';
export * from './core/operation';
export * from './webhooks';
