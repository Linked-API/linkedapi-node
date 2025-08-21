import { TSupportedFunctionName } from '../core/workflow-restoration';

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
 * - notPending (withdrawConnectionRequest))
 * - retrievingNotAllowed (retrieveConnections, fetchCompany, salesNavigatorFetchCompany)
 * - connectionNotFound (removeConnection)
 * - searchingNotAllowed (searchCompanies, searchPeople, salesNavigatorSearchCompanies, salesNavigatorSearchPeople)
 * - companyNotFound (fetchCompany, salesNavigatorFetchCompany)
 * - postNotFound (fetchPost, reactToPost, commentOnPost)
 * - commentingNotAllowed (commentOnPost)
 * - noSalesNavigator (salesNavigatorSendMessage, salesNavigatorSyncConversation, salesNavigatorSearchCompanies, salesNavigatorSearchPeople, salesNavigatorFetchCompany, salesNavigatorFetchPerson)
 */
export const LINKED_API_ACTION_ERROR = {
  personNotFound: 'personNotFound',
  messagingNotAllowed: 'messagingNotAllowed',
  alreadyPending: 'alreadyPending',
  alreadyConnected: 'alreadyConnected',
  emailRequired: 'emailRequired',
  requestNotAllowed: 'requestNotAllowed',
  notPending: 'notPending',
  retrievingNotAllowed: 'retrievingNotAllowed',
  connectionNotFound: 'connectionNotFound',
  searchingNotAllowed: 'searchingNotAllowed',
  companyNotFound: 'companyNotFound',
  postNotFound: 'postNotFound',
  commentingNotAllowed: 'commentingNotAllowed',
  noSalesNavigator: 'noSalesNavigator',
} as const;
export type TLinkedApiActionErrorType =
  (typeof LINKED_API_ACTION_ERROR)[keyof typeof LINKED_API_ACTION_ERROR];

export interface TLinkedApiActionError {
  type: TLinkedApiActionErrorType;
  message: string;
}

/**
 * This error is thrown when a request fails.
 * @see {@link https://linkedapi.io/docs/making-requests/#common-errors}
 */
export const LINKED_API_ERROR = {
  linkedApiTokenRequired: 'linkedApiTokenRequired',
  invalidLinkedApiToken: 'invalidLinkedApiToken',
  identificationTokenRequired: 'identificationTokenRequired',
  invalidIdentificationToken: 'invalidIdentificationToken',
  subscriptionRequired: 'subscriptionRequired',
  invalidRequestPayload: 'invalidRequestPayload',
  invalidWorkflow: 'invalidWorkflow',
  plusPlanRequired: 'plusPlanRequired',
  linkedinAccountSignedOut: 'linkedinAccountSignedOut',
  languageNotSupported: 'languageNotSupported',
  workflowTimeout: 'workflowTimeout',
} as const;
export type TLinkedApiErrorType = (typeof LINKED_API_ERROR)[keyof typeof LINKED_API_ERROR];
export class LinkedApiError extends Error {
  public type: TLinkedApiErrorType;
  public override message: string;
  public details?: unknown;

  constructor(type: TLinkedApiErrorType, message: string, details?: unknown) {
    super(message);
    this.type = type;
    this.message = message;
    this.details = details;
  }

  public static unknownError(
    message: string = 'Unknown error. Please contact support.',
  ): LinkedApiError {
    return new LinkedApiError('unknownError' as TLinkedApiErrorType, message);
  }
}

/**
 * This error is thrown when a workflow times out.
 * Contains workflowId and functionName to restore the workflow.
 */
export class LinkedApiWorkflowTimeoutError extends LinkedApiError {
  public readonly workflowId: string;
  public readonly functionName: TSupportedFunctionName;

  constructor(workflowId: string, functionName: TSupportedFunctionName) {
    super(
      'workflowTimeout',
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
