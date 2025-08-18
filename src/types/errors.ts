import { TSupportedFunctionName } from "../core/workflow-restoration";

/**
 * This error is exposed when a workflow action fails to complete.
 * @see {@link https://linkedapi.io/docs/actions-overview/#result-options}
 * This error signals that the workflow action failed to complete, but the workflow completed as expected.
 * Common types:
 * - personNotFound (sendMessage, syncConversation, checkConnectionStatus, sendConnectionRequest, withdrawConnectionRequest, removeConnection, fetchPerson, salesNavigatorSendMessage, salesNavigatorSyncConversation, salesNavigatorFetchPerson)
 * - messagingNotAllowed (sendMessage, salesNavigatorSendMessage)
 * - alreadyPending (sendConnectionRequest)
 * - alreadyConnected (sendConnectionRequest)
 * - emailRequired (sendConnectionRequest)
 * - requestNotAllowed (sendConnectionRequest)
 * - notPending (withdrawConnectionRequest)
 * - retrievingNotAllowed (retrieveConnections)
 * - connectionNotFound (removeConnection)
 * - searchingNotAllowed (searchCompanies, searchPeople, salesNavigatorSearchCompanies, salesNavigatorSearchPeople)
 * - companyNotFound (fetchCompany, salesNavigatorFetchCompany)
 * - retrievingNotAllowed (fetchCompany, salesNavigatorFetchCompany)
 * - postNotFound (fetchPost, reactToPost, commentOnPost)
 * - commentingNotAllowed (commentOnPost)
 * - noSalesNavigator (salesNavigatorSendMessage, salesNavigatorSyncConversation, salesNavigatorSearchCompanies, salesNavigatorSearchPeople, salesNavigatorFetchCompany, salesNavigatorFetchPerson)
 */
export interface TLinkedApiActionError {
  type: string;
  message: string;
}

/**
 * This error is thrown when a request fails.
 * @see {@link https://linkedapi.io/docs/making-requests/#common-errors}
 */
export class LinkedApiError extends Error {
  /**
   * The type of the error.
   * Common types:
   * - linkedApiTokenRequired
   * - invalidLinkedApiToken
   * - identificationTokenRequired
   * - invalidIdentificationToken
   * - subscriptionRequired
   * - invalidRequestPayload
   * - invalidWorkflow
   * - plusPlanRequired
   * - linkedinAccountSignedOut
   * - languageNotSupported
   * - timeout
   */
  public type: string;
  public override message: string;
  public details?: unknown;

  constructor(type: string, message: string, details?: unknown) {
    super(message);
    this.type = type;
    this.message = message;
    this.details = details;
  }

  public static unknownError(message: string = ""): LinkedApiError {
    return new LinkedApiError("unknownError", message);
  }
}

/**
 * This error is thrown when a workflow times out.
 */
export class LinkedApiWorkflowTimeoutError extends LinkedApiError {
  public readonly workflowId: string;
  public readonly functionName: TSupportedFunctionName;

  constructor(workflowId: string, functionName: TSupportedFunctionName) {
    super(
      "workflowTimeout",
      `Workflow ${workflowId} timed out. Use restoreWorkflow(${workflowId}, ${functionName}) to restore the workflow.`,
      {
        workflowId,
        functionName,
      },
    );
    this.workflowId = workflowId;
    this.functionName = functionName;
  }
}
