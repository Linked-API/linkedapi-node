import { Operation } from './core';
import { buildLinkedApiHttpClient } from './core/linked-api-http-client';
import type { TMappedResponse } from './mappers/base-mapper.abstract';
import {
  CheckConnectionStatus,
  CommentOnPost,
  CustomWorkflow,
  FetchCompany,
  FetchPerson,
  FetchPost,
  NvFetchCompany,
  NvFetchPerson,
  NvSearchCompanies,
  NvSearchPeople,
  NvSendMessage,
  NvSyncConversation,
  ReactToPost,
  RemoveConnection,
  RetrieveConnections,
  RetrievePendingRequests,
  RetrievePerformance,
  RetrieveSSI,
  SearchCompanies,
  SearchPeople,
  SendConnectionRequest,
  SendMessage,
  SyncConversation,
  WithdrawConnectionRequest,
} from './operations';
import {
  HttpClient,
  LinkedApiError,
  TApiUsageAction,
  TApiUsageParams,
  TConversationPollRequest,
  TConversationPollResult,
  TLinkedApiActionErrorType,
  TLinkedApiErrorType,
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
      this.httpClient = buildLinkedApiHttpClient(config);
    }

    this.customWorkflow = new CustomWorkflow(this.httpClient);
    this.sendMessage = new SendMessage(this.httpClient);
    this.syncConversation = new SyncConversation(this.httpClient);
    this.checkConnectionStatus = new CheckConnectionStatus(this.httpClient);
    this.sendConnectionRequest = new SendConnectionRequest(this.httpClient);
    this.withdrawConnectionRequest = new WithdrawConnectionRequest(this.httpClient);
    this.retrievePendingRequests = new RetrievePendingRequests(this.httpClient);
    this.retrieveConnections = new RetrieveConnections(this.httpClient);
    this.removeConnection = new RemoveConnection(this.httpClient);
    this.searchCompanies = new SearchCompanies(this.httpClient);
    this.searchPeople = new SearchPeople(this.httpClient);
    this.fetchCompany = new FetchCompany(this.httpClient);
    this.fetchPerson = new FetchPerson(this.httpClient);
    this.fetchPost = new FetchPost(this.httpClient);
    this.reactToPost = new ReactToPost(this.httpClient);
    this.commentOnPost = new CommentOnPost(this.httpClient);
    this.retrieveSSI = new RetrieveSSI(this.httpClient);
    this.retrievePerformance = new RetrievePerformance(this.httpClient);
    this.nvSendMessage = new NvSendMessage(this.httpClient);
    this.nvSyncConversation = new NvSyncConversation(this.httpClient);
    this.nvSearchCompanies = new NvSearchCompanies(this.httpClient);
    this.nvSearchPeople = new NvSearchPeople(this.httpClient);
    this.nvFetchCompany = new NvFetchCompany(this.httpClient);
    this.nvFetchPerson = new NvFetchPerson(this.httpClient);

    this.operations = [
      this.customWorkflow,
      this.sendMessage,
      this.syncConversation,
      this.checkConnectionStatus,
      this.sendConnectionRequest,
      this.withdrawConnectionRequest,
      this.retrievePendingRequests,
      this.retrieveConnections,
      this.removeConnection,
      this.searchCompanies,
      this.searchPeople,
      this.fetchCompany,
      this.fetchPerson,
      this.fetchPost,
      this.reactToPost,
      this.commentOnPost,
      this.retrieveSSI,
      this.retrievePerformance,
      this.nvSendMessage,
      this.nvSyncConversation,
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
   * const workflowId = await linkedapi.customWorkflow.execute({
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
   * const result = await linkedapi.customWorkflow.result(workflowId);
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
   * const workflowId = await linkedapi.sendMessage.execute({
   *   personUrl: "https://www.linkedin.com/in/john-doe",
   *   text: "Hi John! I saw your recent post about AI and would love to discuss further."
   * });
   *
   * await linkedapi.sendMessage.result(workflowId);
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
   * @param params - Parameters including the person's URL
   * @returns Promise resolving to the sync action
   *
   * @see {@link https://linkedapi.io/docs/working-with-conversations/ Working with Conversations Documentation}
   * @see {@link https://linkedapi.io/docs/action-st-sync-conversation/ st.syncConversation Action Documentation}
   *
   * @example
   * ```typescript
   * const workflowId = await linkedapi.syncConversation.execute({
   *   personUrl: "https://www.linkedin.com/in/john-doe"
   * });
   *
   * await linkedapi.syncConversation.result(workflowId);
   * console.log("Conversation synced and ready for polling");
   * ```
   */
  public syncConversation: SyncConversation;

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
   * const workflowId = await linkedapi.nvSendMessage.execute({
   *   personUrl: "https://www.linkedin.com/in/john-doe",
   *   text: "Hi John! I'm reaching out regarding potential collaboration opportunities.",
   *   subject: "Partnership Opportunity"
   * });
   *
   * await linkedapi.nvSendMessage.result(workflowId);
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
   * @param params - Parameters including the person's URL
   * @returns Promise resolving to the sync action
   *
   * @see {@link https://linkedapi.io/docs/working-with-conversations/ Working with Conversations Documentation}
   * @see {@link https://linkedapi.io/docs/action-nv-sync-conversation/ nv.syncConversation Action Documentation}
   *
   * @example
   * ```typescript
   * const workflowId = await linkedapi.nvSyncConversation.execute({
   *   personUrl: "https://www.linkedin.com/in/john-doe"
   * });
   *
   * await linkedapi.nvSyncConversation.result(workflowId);
   * console.log("Sales Navigator conversation synced and ready for polling");
   * ```
   */
  public nvSyncConversation: NvSyncConversation;

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
   * const workflowId = await linkedapi.fetchPerson.execute({
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
   * const personResult = await linkedapi.fetchPerson.result(workflowId);
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
   * const workflowId = await linkedapi.fetchPerson.execute({
   *   personUrl: "https://www.linkedin.com/in/john-doe"
   * });
   *
   * const basicResult = await linkedapi.fetchPerson.result(workflowId);
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
   * const workflowId = await linkedapi.nvFetchPerson.execute({
   *   personHashedUrl: "https://www.linkedin.com/in/ABC123",
   * });
   *
   * const personResult = await linkedapi.nvFetchPerson.result(workflowId);
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
   * const workflowId = await linkedapi.fetchCompany.execute({
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
   * const companyResult = await linkedapi.fetchCompany.result(workflowId);
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
   * const workflowId = await linkedapi.nvFetchCompany.execute({
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
   * const companyResult = await linkedapi.nvFetchCompany.result(workflowId);
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
   * const workflowId = await linkedapi.fetchPost.execute({
   *   postUrl: "https://www.linkedin.com/posts/john-doe_activity-123456789"
   * });
   *
   * const result = await linkedapi.fetchPost.result(workflowId);
   * if (result.data) {
   *   console.log("Post content:", result.data.text);
   *   console.log("Author:", result.data.author);
   *   console.log("Reactions:", result.data.reactions);
   * }
   * ```
   */
  public fetchPost: FetchPost;

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
   * const workflowId = await linkedapi.searchCompanies.execute({
   *   term: "software development",
   *   filter: {
   *     locations: ["San Francisco", "New York"],
   *     industries: ["Technology", "Software"],
   *     sizes: ["51-200", "201-500"]
   *   },
   *   limit: 25
   * });
   *
   * const companiesResult = await linkedapi.searchCompanies.result(workflowId);
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
   * const workflowId = await linkedapi.nvSearchCompanies.execute({
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
   * const companiesResult = await linkedapi.nvSearchCompanies.result(workflowId);
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
   * const workflowId = await linkedapi.searchPeople.execute({
   *   term: "software engineer React",
   *   filter: {
   *     locations: ["San Francisco Bay Area"],
   *     currentCompanies: ["Google", "Facebook", "Apple"],
   *     industries: ["Technology"]
   *   },
   *   limit: 50
   * });
   *
   * const result = await linkedapi.searchPeople.result(workflowId);
   * if (result.data) {
   *   console.log("Found professionals:", result.data.length);
   * }
   * ```
   */
  public searchPeople: SearchPeople;

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
   * const workflowId = await linkedapi.nvSearchPeople.execute({
   *   term: "VP Marketing B2B SaaS",
   *   filter: {
   *     locations: ["United States"],
   *     currentCompanies: ["Salesforce", "HubSpot"],
   *     position: "VP"
   *   },
   *   limit: 25
   * });
   *
   * const result = await linkedapi.nvSearchPeople.result(workflowId);
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
   * @see {@link https://linkedapi.io/docs/working-with-connection-requests/ Working with Connection Requests Documentation}
   * @see {@link https://linkedapi.io/docs/action-st-send-connection-request/ st.sendConnectionRequest Action Documentation}
   *
   * @example
   * ```typescript
   * const workflowId = await linkedapi.sendConnectionRequest.execute({
   *   personUrl: "https://www.linkedin.com/in/john-doe",
   *   note: "Hi John, I'd love to connect and discuss opportunities in tech!"
   * });
   *
   * await linkedapi.sendConnectionRequest.result(workflowId);
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
   * const workflowId = await linkedapi.checkConnectionStatus.execute({
   *   personUrl: "https://www.linkedin.com/in/john-doe"
   * });
   *
   * const result = await linkedapi.checkConnectionStatus.result(workflowId);
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
   * @see {@link https://linkedapi.io/docs/working-with-connection-requests/ Working with Connection Requests Documentation}
   * @see {@link https://linkedapi.io/docs/action-st-withdraw-connection-request/ st.withdrawConnectionRequest Action Documentation}
   *
   * @example
   * ```typescript
   * const workflowId = await linkedapi.withdrawConnectionRequest.execute({
   *   personUrl: "https://www.linkedin.com/in/john-doe"
   * });
   *
   * await linkedapi.withdrawConnectionRequest.result(workflowId);
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
   * @see {@link https://linkedapi.io/docs/working-with-connection-requests/ Working with Connection Requests Documentation}
   * @see {@link https://linkedapi.io/docs/action-st-retrieve-pending-requests/ st.retrievePendingRequests Action Documentation}
   *
   * @example
   * ```typescript
   * const workflowId = await linkedapi.retrievePendingRequests.execute();
   *
   * const result = await linkedapi.retrievePendingRequests.result(workflowId);
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
   * Retrieve your LinkedIn connections with optional filtering.
   *
   * This method fetches a list of your LinkedIn connections. You can filter by various criteria
   * like name, position, location, industry, company, and school.
   *
   * @param params - Parameters including optional filters and pagination options
   * @returns Promise resolving to an object containing an array of connections
   *
   * @see {@link https://linkedapi.io/docs/managing-existing-connections/ Managing Existing Connections Documentation}
   * @see {@link https://linkedapi.io/docs/action-st-retrieve-connections/ st.retrieveConnections Action Documentation}
   *
   * @example
   * ```typescript
   * const workflowId = await linkedapi.retrieveConnections.execute({
   *   filter: {
   *     firstName: "John",
   *     industries: ["Technology", "Software"],
   *     locations: ["San Francisco Bay Area"],
   *     currentCompanies: ["Google", "Microsoft"]
   *   },
   *   limit: 50
   * });
   *
   * const result = await linkedapi.retrieveConnections.result(workflowId);
   * if (result.data) {
   *   console.log("Filtered connections:", result.data.length);
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
   * const workflowId = await linkedapi.removeConnection.execute({
   *   personUrl: "https://www.linkedin.com/in/john-doe"
   * });
   *
   * await linkedapi.removeConnection.result(workflowId);
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
   * const workflowId = await linkedapi.reactToPost.execute({
   *   postUrl: "https://www.linkedin.com/posts/john-doe_activity-123456789",
   *   type: "like"
   * });
   *
   * await linkedapi.reactToPost.result(workflowId);
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
   * const workflowId = await linkedapi.commentOnPost.execute({
   *   postUrl: "https://www.linkedin.com/posts/john-doe_activity-123456789",
   *   text: "Great insights! Thanks for sharing this valuable information."
   * });
   *
   * await linkedapi.commentOnPost.result(workflowId);
   * console.log("Comment posted successfully");
   * ```
   */
  public commentOnPost: CommentOnPost;

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
   * const workflowId = await linkedapi.retrieveSSI.execute();
   *
   * const result = await linkedapi.retrieveSSI.result(workflowId);
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
   * const workflowId = await linkedapi.retrievePerformance.execute();
   *
   * const result = await linkedapi.retrievePerformance.result(workflowId);
   * if (result.data) {
   *   console.log("Profile views:", result.data.profileViews);
   *   console.log("Search appearances:", result.data.searchAppearances);
   *   console.log("Post impressions:", result.data.postImpressions);
   * }
   * ```
   */
  public retrievePerformance: RetrievePerformance;

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
