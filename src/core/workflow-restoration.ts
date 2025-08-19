import type { TBaseFetchPersonParamsWide } from "../types/actions/person";
import type {
  TBaseFetchCompanyParamsWide,
  TNvBaseFetchCompanyParamsWide,
} from "../types/actions/company";
import type { TWorkflowResponse } from "../types/workflows";
import type { BaseMapper } from "../mappers/base-mapper.abstract";

export type TRestoreResultType<T extends TSupportedFunctionName> =
  T extends typeof FUNCTION_NAME.executeCustomWorkflow
    ? TWorkflowResponse
    : TRestoreMapperReturnType<T> extends BaseMapper<TBaseActionParams, infer R>
      ? R
      : never;

import {
  FetchPersonMapper,
  FetchCompanyMapper,
  NvFetchCompanyMapper,
  NvFetchPersonMapper,
  SearchCompaniesMapper,
  NvSearchCompaniesMapper,
  SearchPeopleMapper,
  NvSearchPeopleMapper,
  RetrieveConnectionsMapper,
  RetrievePendingRequestsMapper,
  SimpleWorkflowMapper,
  VoidWorkflowMapper,
} from "../mappers";
import {
  TFetchPostParams,
  TFetchPostResult,
  TSendMessageParams,
  TSyncConversationParams,
  TNvSendMessageParams,
  TNvSyncConversationParams,
  TSendConnectionRequestParams,
  TCheckConnectionStatusParams,
  TCheckConnectionStatusResult,
  TWithdrawConnectionRequestParams,
  TRemoveConnectionParams,
  TReactToPostParams,
  TCommentOnPostParams,
  TRetrieveSSIResult,
  TRetrievePerformanceResult,
  TBaseActionParams,
} from "../types";

export type TRestoreMapperReturnType<T extends TSupportedFunctionName> =
  T extends typeof FUNCTION_NAME.fetchPerson
    ? FetchPersonMapper<TBaseFetchPersonParamsWide>
    : T extends typeof FUNCTION_NAME.fetchCompany
      ? FetchCompanyMapper<TBaseFetchCompanyParamsWide>
      : T extends typeof FUNCTION_NAME.salesNavigatorFetchCompany
        ? NvFetchCompanyMapper<TNvBaseFetchCompanyParamsWide>
        : T extends typeof FUNCTION_NAME.salesNavigatorFetchPerson
          ? NvFetchPersonMapper
          : T extends typeof FUNCTION_NAME.fetchPost
            ? SimpleWorkflowMapper<TFetchPostParams, TFetchPostResult>
            : T extends typeof FUNCTION_NAME.searchCompanies
              ? SearchCompaniesMapper
              : T extends typeof FUNCTION_NAME.salesNavigatorSearchCompanies
                ? NvSearchCompaniesMapper
                : T extends typeof FUNCTION_NAME.searchPeople
                  ? SearchPeopleMapper
                  : T extends typeof FUNCTION_NAME.salesNavigatorSearchPeople
                    ? NvSearchPeopleMapper
                    : T extends typeof FUNCTION_NAME.sendMessage
                      ? VoidWorkflowMapper<TSendMessageParams>
                      : T extends typeof FUNCTION_NAME.syncConversation
                        ? VoidWorkflowMapper<TSyncConversationParams>
                        : T extends typeof FUNCTION_NAME.salesNavigatorSendMessage
                          ? VoidWorkflowMapper<TNvSendMessageParams>
                          : T extends typeof FUNCTION_NAME.salesNavigatorSyncConversation
                            ? VoidWorkflowMapper<TNvSyncConversationParams>
                            : T extends typeof FUNCTION_NAME.sendConnectionRequest
                              ? VoidWorkflowMapper<TSendConnectionRequestParams>
                              : T extends typeof FUNCTION_NAME.checkConnectionStatus
                                ? SimpleWorkflowMapper<
                                    TCheckConnectionStatusParams,
                                    TCheckConnectionStatusResult
                                  >
                                : T extends typeof FUNCTION_NAME.withdrawConnectionRequest
                                  ? VoidWorkflowMapper<TWithdrawConnectionRequestParams>
                                  : T extends typeof FUNCTION_NAME.retrievePendingRequests
                                    ? RetrievePendingRequestsMapper
                                    : T extends typeof FUNCTION_NAME.retrieveConnections
                                      ? RetrieveConnectionsMapper
                                      : T extends typeof FUNCTION_NAME.removeConnection
                                        ? VoidWorkflowMapper<TRemoveConnectionParams>
                                        : T extends typeof FUNCTION_NAME.reactToPost
                                          ? VoidWorkflowMapper<TReactToPostParams>
                                          : T extends typeof FUNCTION_NAME.commentOnPost
                                            ? VoidWorkflowMapper<TCommentOnPostParams>
                                            : T extends typeof FUNCTION_NAME.retrieveSSI
                                              ? SimpleWorkflowMapper<
                                                  TBaseActionParams,
                                                  TRetrieveSSIResult
                                                >
                                              : T extends typeof FUNCTION_NAME.retrievePerformance
                                                ? SimpleWorkflowMapper<
                                                    TBaseActionParams,
                                                    TRetrievePerformanceResult
                                                  >
                                                : T extends typeof FUNCTION_NAME.executeCustomWorkflow
                                                  ? null // Special case: no mapper needed, will return raw TWorkflowResponse
                                                  : never;

export const FUNCTION_NAME = {
  fetchPerson: "fetchPerson",
  fetchCompany: "fetchCompany",
  salesNavigatorFetchCompany: "salesNavigatorFetchCompany",
  salesNavigatorFetchPerson: "salesNavigatorFetchPerson",
  fetchPost: "fetchPost",
  searchCompanies: "searchCompanies",
  salesNavigatorSearchCompanies: "salesNavigatorSearchCompanies",
  searchPeople: "searchPeople",
  salesNavigatorSearchPeople: "salesNavigatorSearchPeople",
  sendMessage: "sendMessage",
  syncConversation: "syncConversation",
  salesNavigatorSendMessage: "salesNavigatorSendMessage",
  salesNavigatorSyncConversation: "salesNavigatorSyncConversation",
  sendConnectionRequest: "sendConnectionRequest",
  checkConnectionStatus: "checkConnectionStatus",
  withdrawConnectionRequest: "withdrawConnectionRequest",
  retrievePendingRequests: "retrievePendingRequests",
  retrieveConnections: "retrieveConnections",
  removeConnection: "removeConnection",
  reactToPost: "reactToPost",
  commentOnPost: "commentOnPost",
  retrieveSSI: "retrieveSSI",
  retrievePerformance: "retrievePerformance",
  executeCustomWorkflow: "executeCustomWorkflow", // Special case: no mapper needed, will return raw TWorkflowResponse
} as const;
export type TSupportedFunctionName =
  (typeof FUNCTION_NAME)[keyof typeof FUNCTION_NAME];

/**
 * Internal function to restore a mapper from a function name.
 * This provides type-safe mapper creation for workflow restoration.
 */
export function createMapperFromFunctionName<T extends TSupportedFunctionName>(
  functionName: T,
): TRestoreMapperReturnType<T> {
  switch (functionName) {
    case FUNCTION_NAME.fetchPerson: {
      return new FetchPersonMapper<TBaseFetchPersonParamsWide>() as TRestoreMapperReturnType<T>;
    }
    case FUNCTION_NAME.fetchCompany: {
      return new FetchCompanyMapper<TBaseFetchCompanyParamsWide>() as TRestoreMapperReturnType<T>;
    }
    case FUNCTION_NAME.salesNavigatorFetchCompany: {
      return new NvFetchCompanyMapper<TNvBaseFetchCompanyParamsWide>() as TRestoreMapperReturnType<T>;
    }
    case FUNCTION_NAME.salesNavigatorFetchPerson: {
      return new NvFetchPersonMapper() as TRestoreMapperReturnType<T>;
    }
    case FUNCTION_NAME.fetchPost: {
      return new SimpleWorkflowMapper<TFetchPostParams, TFetchPostResult>({
        actionType: "st.openPost",
        defaultParams: { basicInfo: true },
      }) as TRestoreMapperReturnType<T>;
    }
    case FUNCTION_NAME.searchCompanies: {
      return new SearchCompaniesMapper() as TRestoreMapperReturnType<T>;
    }
    case FUNCTION_NAME.salesNavigatorSearchCompanies: {
      return new NvSearchCompaniesMapper() as TRestoreMapperReturnType<T>;
    }
    case FUNCTION_NAME.searchPeople: {
      return new SearchPeopleMapper() as TRestoreMapperReturnType<T>;
    }
    case FUNCTION_NAME.salesNavigatorSearchPeople: {
      return new NvSearchPeopleMapper() as TRestoreMapperReturnType<T>;
    }
    case FUNCTION_NAME.sendMessage: {
      return new VoidWorkflowMapper<TSendMessageParams>(
        "st.sendMessage",
      ) as TRestoreMapperReturnType<T>;
    }
    case FUNCTION_NAME.syncConversation: {
      return new VoidWorkflowMapper<TSyncConversationParams>(
        "st.syncConversation",
      ) as TRestoreMapperReturnType<T>;
    }
    case FUNCTION_NAME.salesNavigatorSendMessage: {
      return new VoidWorkflowMapper<TNvSendMessageParams>(
        "nv.sendMessage",
      ) as TRestoreMapperReturnType<T>;
    }
    case FUNCTION_NAME.salesNavigatorSyncConversation: {
      return new VoidWorkflowMapper<TNvSyncConversationParams>(
        "nv.syncConversation",
      ) as TRestoreMapperReturnType<T>;
    }
    case FUNCTION_NAME.sendConnectionRequest: {
      return new VoidWorkflowMapper<TSendConnectionRequestParams>(
        "st.sendConnectionRequest",
      ) as TRestoreMapperReturnType<T>;
    }
    case FUNCTION_NAME.checkConnectionStatus: {
      return new SimpleWorkflowMapper<
        TCheckConnectionStatusParams,
        TCheckConnectionStatusResult
      >({
        actionType: "st.checkConnectionStatus",
      }) as TRestoreMapperReturnType<T>;
    }
    case FUNCTION_NAME.withdrawConnectionRequest: {
      return new VoidWorkflowMapper<TWithdrawConnectionRequestParams>(
        "st.withdrawConnectionRequest",
      ) as TRestoreMapperReturnType<T>;
    }
    case FUNCTION_NAME.retrievePendingRequests: {
      return new RetrievePendingRequestsMapper() as TRestoreMapperReturnType<T>;
    }
    case FUNCTION_NAME.retrieveConnections: {
      return new RetrieveConnectionsMapper() as TRestoreMapperReturnType<T>;
    }
    case FUNCTION_NAME.removeConnection: {
      return new VoidWorkflowMapper<TRemoveConnectionParams>(
        "st.removeConnection",
      ) as TRestoreMapperReturnType<T>;
    }
    case FUNCTION_NAME.reactToPost: {
      return new VoidWorkflowMapper<TReactToPostParams>(
        "st.reactToPost",
      ) as TRestoreMapperReturnType<T>;
    }
    case FUNCTION_NAME.commentOnPost: {
      return new VoidWorkflowMapper<TCommentOnPostParams>(
        "st.commentOnPost",
      ) as TRestoreMapperReturnType<T>;
    }
    case FUNCTION_NAME.retrieveSSI: {
      return new SimpleWorkflowMapper<TBaseActionParams, TRetrieveSSIResult>({
        actionType: "st.retrieveSSI",
      }) as TRestoreMapperReturnType<T>;
    }
    case FUNCTION_NAME.retrievePerformance: {
      return new SimpleWorkflowMapper<
        TBaseActionParams,
        TRetrievePerformanceResult
      >({
        actionType: "st.retrievePerformance",
      }) as TRestoreMapperReturnType<T>;
    }
    case FUNCTION_NAME.executeCustomWorkflow: {
      return null as TRestoreMapperReturnType<T>;
    }
    default:
      throw new Error(`Unsupported functionName: ${functionName}`);
  }
}
