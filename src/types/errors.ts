import { TOperationName } from '../core';

/**
 * This error is exposed when a workflow action fails to complete.
 * @see {@link https://linkedapi.io/docs/actions-overview/#result-options}
 * This error signals that the workflow action failed to complete, but the workflow completed as expected.
 * Common types:
 * - personNotFound (sendMessage, syncConversation, checkConnectionStatus, sendConnectionRequest, withdrawConnectionRequest, removeConnection, fetchPerson, nvSendMessage, nvSyncConversation, nvFetchPerson)
 * - selfProfileNotAllowed (fetchPerson, nvFetchPerson)
 * - messagingNotAllowed (sendMessage, nvSendMessage)
 * - alreadyPending (sendConnectionRequest)
 * - alreadyConnected (sendConnectionRequest)
 * - emailRequired (sendConnectionRequest)
 * - requestNotAllowed (sendConnectionRequest)
 * - notPending (withdrawConnectionRequest))
 * - retrievingNotAllowed (retrieveConnections, fetchCompany, nvFetchCompany)
 * - connectionNotFound (removeConnection)
 * - searchingNotAllowed (searchCompanies, searchPeople, nvSearchCompanies, nvSearchPeople)
 * - companyNotFound (fetchCompany, nvFetchCompany)
 * - postNotFound (fetchPost, reactToPost, commentOnPost)
 * - commentingNotAllowed (commentOnPost)
 * - noSalesNavigator (nvSendMessage, nvSyncConversation, nvSearchCompanies, nvSearchPeople, nvFetchCompany, nvFetchPerson)
 * - conversationsNotSynced (pollConversations)
 */
export const LINKED_API_ACTION_ERROR = {
  personNotFound: 'personNotFound',
  selfProfileNotAllowed: 'selfProfileNotAllowed',
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
  conversationsNotSynced: 'conversationsNotSynced',
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
  httpError: 'httpError',
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
 * Contains workflowId and operationName to continue checking the workflow.
 */
export class LinkedApiWorkflowTimeoutError extends LinkedApiError {
  public readonly workflowId: string;
  public readonly operationName: TOperationName;

  constructor(workflowId: string, operationName: TOperationName) {
    super(
      'workflowTimeout',
      `Workflow ${workflowId} timed out. Call ${operationName}.result() again to continue checking the workflow.`,
      {
        workflowId,
        operationName,
      },
    );
    this.workflowId = workflowId;
    this.operationName = operationName;
  }
}
