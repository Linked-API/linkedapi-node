import type {
  TSendMessageParams,
  TSyncConversationParams,
  TNvSendMessageParams,
  TNvSyncConversationParams,
  TConversationPollRequest,
  TConversationPollResult,
  TConversationPollResponse,
} from "../types/actions/message";
import { VoidWorkflowMapper } from "../core/void-workflow-mapper";
import { WorkflowHandler } from "../core/workflow-handler";
import type { WorkflowExecutor } from "../core/workflow-executor";
import { HttpClient } from "../core/http-client";

/**
 * LinkedIn messaging functionality for the Account API.
 *
 * This class provides methods for sending messages, syncing conversations, and polling message history
 * on both standard LinkedIn and Sales Navigator platforms. It supports workflow-based messaging actions
 * and HTTP-based conversation polling.
 *
 * @see {@link https://linkedapi.io/docs/account-api/working-with-conversations/ Working with Conversations Documentation}
 * @see {@link https://linkedapi.io/docs/account-api/sending-message/ Sending Messages Documentation}
 *
 * @example
 * ```typescript
 * // Access messaging through the Account API
 * const linkedapi = new LinkedApi({ accountApiToken: "...", identificationToken: "..." });
 *
 * // Send a message
 * await linkedapi.account.messaging.sendMessage({
 *   personUrl: "https://www.linkedin.com/in/john-doe",
 *   text: "Hello! I'd love to connect."
 * });
 *
 * // Poll conversations
 * const response = await linkedapi.account.messaging.pollConversations([
 *   { personUrl: "https://www.linkedin.com/in/john-doe", type: "st" }
 * ]);
 * ```
 */
export class Messaging {
  /**
   * Creates a new Messaging instance.
   *
   * @param workflowExecutor - The workflow executor for managing LinkedIn automation workflows
   * @param httpClient - HTTP client configured with authentication headers for API requests
   */
  constructor(
    private workflowExecutor: WorkflowExecutor,
    private httpClient: HttpClient,
  ) {}

  /**
   * Send a message to a LinkedIn user via standard LinkedIn messaging.
   *
   * This method sends a direct message to a person on LinkedIn. The recipient must be a connection
   * or allow messages from anyone. This uses the standard LinkedIn messaging interface.
   *
   * @param params - Parameters including the person's URL and message text
   * @returns Promise resolving to a WorkflowHandler for the message sending action
   *
   * @see {@link https://linkedapi.io/docs/account-api/sending-message/ Sending Messages Documentation}
   * @see {@link https://linkedapi.io/docs/account-api/action-st-send-message/ st.sendMessage Action Documentation}
   *
   * @example
   * ```typescript
   * const messageWorkflow = await linkedapi.account.messaging.sendMessage({
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
   * @see {@link https://linkedapi.io/docs/account-api/working-with-conversations/ Working with Conversations Documentation}
   * @see {@link https://linkedapi.io/docs/account-api/action-st-sync-conversation/ st.syncConversation Action Documentation}
   *
   * @example
   * ```typescript
   * const syncWorkflow = await linkedapi.account.messaging.syncConversation({
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
   * @see {@link https://linkedapi.io/docs/account-api/sending-message/ Sending Messages Documentation}
   * @see {@link https://linkedapi.io/docs/account-api/action-nv-send-message/ nv.sendMessage Action Documentation}
   *
   * @example
   * ```typescript
   * const nvMessageWorkflow = await linkedapi.account.messaging.salesNavigatorSendMessage({
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
   * @see {@link https://linkedapi.io/docs/account-api/working-with-conversations/ Working with Conversations Documentation}
   * @see {@link https://linkedapi.io/docs/account-api/action-nv-sync-conversation/ nv.syncConversation Action Documentation}
   *
   * @example
   * ```typescript
   * const nvSyncWorkflow = await linkedapi.account.messaging.salesNavigatorSyncConversation({
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
   * @see {@link https://linkedapi.io/docs/account-api/working-with-conversations/ Working with Conversations Documentation}
   *
   * @example
   * ```typescript
   * // Poll multiple conversations
   * const pollResponse = await linkedapi.account.messaging.pollConversations([
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
      "/account/conversations/poll",
      conversations,
    );

    return {
      success: response.success,
      result: response.result,
      error: response.error,
    };
  }
}
