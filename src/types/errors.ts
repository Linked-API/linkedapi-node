import { TOperationName } from '../core';

/**
 * This error is exposed when a workflow action fails to complete.
 * @see {@link https://linkedapi.io/docs/actions-overview/#result-options}
 * This error signals that the workflow action failed to complete, but the workflow completed as expected.
 * Common types:
 * - personNotFound (sendMessage, syncConversation, checkConnectionStatus, sendConnectionRequest, withdrawConnectionRequest, removeConnection, endorsePersonSkill, endorsePersonSkills, fetchPerson, nvSendMessage, nvSyncConversation, nvFetchPerson)
 * - selfProfileNotAllowed (fetchPerson, nvFetchPerson)
 * - personLikelyChangedPublicUrl (fetchPerson, sendMessage)
 * - messagingNotAllowed (sendMessage, nvSendMessage)
 * - alreadyPending (sendConnectionRequest)
 * - alreadyConnected (sendConnectionRequest)
 * - emailRequired (sendConnectionRequest)
 * - noteTooLong (sendConnectionRequest)
 * - noteLimitExceeded (sendConnectionRequest)
 * - invitationAlreadyReceived (sendConnectionRequest)
 * - requestNotAllowed (sendConnectionRequest)
 * - notPending (withdrawConnectionRequest))
 * - noPendingRequest (acceptInvitation, ignoreInvitation)
 * - retrievingNotAllowed (retrieveConnections, fetchCompany, nvFetchCompany)
 * - connectionNotFound (removeConnection, endorsePersonSkill, endorsePersonSkills)
 * - skillNotFound (endorsePersonSkill)
 * - endorsementUnavailable (endorsePersonSkill, endorsePersonSkills)
 * - limitExceeded (operations subject to action limits, including endorsePersonSkill and endorsePersonSkills)
 * - searchingNotAllowed (searchCompanies, searchPeople, searchJobs, searchPosts, nvSearchCompanies, nvSearchPeople)
 * - filterNotApplied (searchPeople, searchCompanies, searchPosts, retrieveConnections, fetchCompany, nvSearchPeople, nvSearchCompanies, nvFetchCompany)
 * - searchInterfaceMismatch (searchJobs)
 * - searchTemporarilyUnavailable (nvSearchCompanies, nvSearchPeople, nvFetchCompany)
 * - companyNotFound (fetchCompany, nvFetchCompany)
 * - postNotFound (fetchPost, reactToPost, commentOnPost, createRepost)
 * - jobNotFound (fetchJob)
 * - commentingNotAllowed (commentOnPost)
 * - commentNotFound (openComment, reactToComment, replyToComment)
 * - replyingNotAllowed (replyToComment)
 * - duplicateComment (commentOnPost, replyToComment)
 * - noPostingPermission (createPost, reactToPost, commentOnPost)
 * - textTooLong (createPost)
 * - unsupportedAttachmentType, missingDocumentName, urlNotAccessible, fileTooLarge, unsupportedMimeType, tooManyAttachments, mixingNotAllowed (createPost)
 * - mentionNotResolved (createPost, createRepost)
 * - repostNotAllowed (createRepost)
 * - alreadyReposted (createRepost)
 * - noSalesNavigator (nvSendMessage, nvSyncConversation, nvSyncInbox, nvSearchCompanies, nvSearchPeople, nvFetchCompany, nvFetchPerson, nvManageConversation)
 * - salesNavigatorOnboardingRequired (nvSearchCompanies, nvSearchPeople)
 * - conversationsNotSynced (pollConversations)
 * - threadNotFound (manageConversation, nvManageConversation)
 * - ssiNotAvailable (retrieveSSI)
 * - unexpectedError (any operation)
 */
export const LINKED_API_ACTION_ERROR = {
  personNotFound: 'personNotFound',
  selfProfileNotAllowed: 'selfProfileNotAllowed',
  personLikelyChangedPublicUrl: 'personLikelyChangedPublicUrl',
  messagingNotAllowed: 'messagingNotAllowed',
  alreadyPending: 'alreadyPending',
  alreadyConnected: 'alreadyConnected',
  emailRequired: 'emailRequired',
  noteTooLong: 'noteTooLong',
  noteLimitExceeded: 'noteLimitExceeded',
  invitationAlreadyReceived: 'invitationAlreadyReceived',
  requestNotAllowed: 'requestNotAllowed',
  notPending: 'notPending',
  noPendingRequest: 'noPendingRequest',
  retrievingNotAllowed: 'retrievingNotAllowed',
  connectionNotFound: 'connectionNotFound',
  skillNotFound: 'skillNotFound',
  endorsementUnavailable: 'endorsementUnavailable',
  limitExceeded: 'limitExceeded',
  searchingNotAllowed: 'searchingNotAllowed',
  searchInterfaceMismatch: 'searchInterfaceMismatch',
  searchTemporarilyUnavailable: 'searchTemporarilyUnavailable',
  filterNotApplied: 'filterNotApplied',
  companyNotFound: 'companyNotFound',
  postNotFound: 'postNotFound',
  jobNotFound: 'jobNotFound',
  commentingNotAllowed: 'commentingNotAllowed',
  commentNotFound: 'commentNotFound',
  replyingNotAllowed: 'replyingNotAllowed',
  duplicateComment: 'duplicateComment',
  noPostingPermission: 'noPostingPermission',
  textTooLong: 'textTooLong',
  unsupportedAttachmentType: 'unsupportedAttachmentType',
  missingDocumentName: 'missingDocumentName',
  urlNotAccessible: 'urlNotAccessible',
  fileTooLarge: 'fileTooLarge',
  unsupportedMimeType: 'unsupportedMimeType',
  tooManyAttachments: 'tooManyAttachments',
  mixingNotAllowed: 'mixingNotAllowed',
  mentionNotResolved: 'mentionNotResolved',
  repostNotAllowed: 'repostNotAllowed',
  alreadyReposted: 'alreadyReposted',
  noSalesNavigator: 'noSalesNavigator',
  salesNavigatorOnboardingRequired: 'salesNavigatorOnboardingRequired',
  conversationsNotSynced: 'conversationsNotSynced',
  threadNotFound: 'threadNotFound',
  ssiNotAvailable: 'ssiNotAvailable',
  unexpectedError: 'unexpectedError',
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
  trialLimitReached: 'trialLimitReached',
  invalidRequestPayload: 'invalidRequestPayload',
  invalidWorkflow: 'invalidWorkflow',
  plusPlanRequired: 'plusPlanRequired',
  linkedinAccountSignedOut: 'linkedinAccountSignedOut',
  languageNotSupported: 'languageNotSupported',
  workflowTimeout: 'workflowTimeout',
  outsideWorkingHours: 'outsideWorkingHours',
  workingHoursWaitExpired: 'workingHoursWaitExpired',
  cancelledByUser: 'cancelledByUser',
  unexpectedError: 'unexpectedError',
  httpError: 'httpError',
  tooManyRequests: 'tooManyRequests',
  accountNotFound: 'accountNotFound',
  accountIdRequired: 'accountIdRequired',
  sessionNotFound: 'sessionNotFound',
  noAvailableSeats: 'noAvailableSeats',
  dailyConnectionAttemptsExceeded: 'dailyConnectionAttemptsExceeded',
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
