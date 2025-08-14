import type { TBaseFetchPersonParamsWide } from "../types/actions/person";
import type { TBaseFetchCompanyParamsWide } from "../types/actions/company";
import type { TNvBaseFetchCompanyParamsWide } from "../types/actions/company.sales-navigator";
import type { TWorkflowResponse } from "../types/workflows";
import type { BaseMapper } from "../mappers/base-mapper.abstract";

export type TRestoreResultType<T extends TSupportedFunctionName> =
  T extends "executeCustomWorkflow"
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

export type TRestoreMapperReturnType<T extends string> = T extends "fetchPerson"
  ? FetchPersonMapper<TBaseFetchPersonParamsWide>
  : T extends "fetchCompany"
    ? FetchCompanyMapper<TBaseFetchCompanyParamsWide>
    : T extends "salesNavigatorFetchCompany"
      ? NvFetchCompanyMapper<TNvBaseFetchCompanyParamsWide>
      : T extends "salesNavigatorFetchPerson"
        ? NvFetchPersonMapper
        : T extends "fetchPost"
          ? SimpleWorkflowMapper<TFetchPostParams, TFetchPostResult>
          : T extends "searchCompanies"
            ? SearchCompaniesMapper
            : T extends "salesNavigatorSearchCompanies"
              ? NvSearchCompaniesMapper
              : T extends "searchPeople"
                ? SearchPeopleMapper
                : T extends "salesNavigatorSearchPeople"
                  ? NvSearchPeopleMapper
                  : T extends "sendMessage"
                    ? VoidWorkflowMapper<TSendMessageParams>
                    : T extends "syncConversation"
                      ? VoidWorkflowMapper<TSyncConversationParams>
                      : T extends "salesNavigatorSendMessage"
                        ? VoidWorkflowMapper<TNvSendMessageParams>
                        : T extends "salesNavigatorSyncConversation"
                          ? VoidWorkflowMapper<TNvSyncConversationParams>
                          : T extends "sendConnectionRequest"
                            ? VoidWorkflowMapper<TSendConnectionRequestParams>
                            : T extends "checkConnectionStatus"
                              ? SimpleWorkflowMapper<
                                  TCheckConnectionStatusParams,
                                  TCheckConnectionStatusResult
                                >
                              : T extends "withdrawConnectionRequest"
                                ? VoidWorkflowMapper<TWithdrawConnectionRequestParams>
                                : T extends "retrievePendingRequests"
                                  ? RetrievePendingRequestsMapper
                                  : T extends "retrieveConnections"
                                    ? RetrieveConnectionsMapper
                                    : T extends "removeConnection"
                                      ? VoidWorkflowMapper<TRemoveConnectionParams>
                                      : T extends "reactToPost"
                                        ? VoidWorkflowMapper<TReactToPostParams>
                                        : T extends "commentOnPost"
                                          ? VoidWorkflowMapper<TCommentOnPostParams>
                                          : T extends "retrieveSSI"
                                            ? SimpleWorkflowMapper<
                                                TBaseActionParams,
                                                TRetrieveSSIResult
                                              >
                                            : T extends "retrievePerformance"
                                              ? SimpleWorkflowMapper<
                                                  TBaseActionParams,
                                                  TRetrievePerformanceResult
                                                >
                                              : T extends "executeCustomWorkflow"
                                                ? null // Special case: no mapper needed, will return raw TWorkflowResponse
                                                : never;

export type TSupportedFunctionName =
  | "fetchPerson"
  | "fetchCompany"
  | "salesNavigatorFetchCompany"
  | "salesNavigatorFetchPerson"
  | "fetchPost"
  | "searchCompanies"
  | "salesNavigatorSearchCompanies"
  | "searchPeople"
  | "salesNavigatorSearchPeople"
  | "sendMessage"
  | "syncConversation"
  | "salesNavigatorSendMessage"
  | "salesNavigatorSyncConversation"
  | "sendConnectionRequest"
  | "checkConnectionStatus"
  | "withdrawConnectionRequest"
  | "retrievePendingRequests"
  | "retrieveConnections"
  | "removeConnection"
  | "reactToPost"
  | "commentOnPost"
  | "retrieveSSI"
  | "retrievePerformance"
  | "executeCustomWorkflow"; // Special case: no mapper needed, will return raw TWorkflowResponse

/**
 * Internal function to restore a mapper from a function name.
 * This provides type-safe mapper creation for workflow restoration.
 */
export function createMapperFromFunctionName<T extends TSupportedFunctionName>(
  functionName: T,
): TRestoreMapperReturnType<T> {
  switch (functionName) {
    case "fetchPerson": {
      return new FetchPersonMapper<TBaseFetchPersonParamsWide>() as TRestoreMapperReturnType<T>;
    }
    case "fetchCompany": {
      return new FetchCompanyMapper<TBaseFetchCompanyParamsWide>() as TRestoreMapperReturnType<T>;
    }
    case "salesNavigatorFetchCompany": {
      return new NvFetchCompanyMapper<TNvBaseFetchCompanyParamsWide>() as TRestoreMapperReturnType<T>;
    }
    case "salesNavigatorFetchPerson": {
      return new NvFetchPersonMapper() as TRestoreMapperReturnType<T>;
    }
    case "fetchPost": {
      return new SimpleWorkflowMapper<TFetchPostParams, TFetchPostResult>({
        actionType: "st.openPost",
        defaultParams: { basicInfo: true },
      }) as TRestoreMapperReturnType<T>;
    }
    case "searchCompanies": {
      return new SearchCompaniesMapper() as TRestoreMapperReturnType<T>;
    }
    case "salesNavigatorSearchCompanies": {
      return new NvSearchCompaniesMapper() as TRestoreMapperReturnType<T>;
    }
    case "searchPeople": {
      return new SearchPeopleMapper() as TRestoreMapperReturnType<T>;
    }
    case "salesNavigatorSearchPeople": {
      return new NvSearchPeopleMapper() as TRestoreMapperReturnType<T>;
    }
    case "sendMessage": {
      return new VoidWorkflowMapper<TSendMessageParams>(
        "st.sendMessage",
      ) as TRestoreMapperReturnType<T>;
    }
    case "syncConversation": {
      return new VoidWorkflowMapper<TSyncConversationParams>(
        "st.syncConversation",
      ) as TRestoreMapperReturnType<T>;
    }
    case "salesNavigatorSendMessage": {
      return new VoidWorkflowMapper<TNvSendMessageParams>(
        "nv.sendMessage",
      ) as TRestoreMapperReturnType<T>;
    }
    case "salesNavigatorSyncConversation": {
      return new VoidWorkflowMapper<TNvSyncConversationParams>(
        "nv.syncConversation",
      ) as TRestoreMapperReturnType<T>;
    }
    case "sendConnectionRequest": {
      return new VoidWorkflowMapper<TSendConnectionRequestParams>(
        "st.sendConnectionRequest",
      ) as TRestoreMapperReturnType<T>;
    }
    case "checkConnectionStatus": {
      return new SimpleWorkflowMapper<
        TCheckConnectionStatusParams,
        TCheckConnectionStatusResult
      >({
        actionType: "st.checkConnectionStatus",
      }) as TRestoreMapperReturnType<T>;
    }
    case "withdrawConnectionRequest": {
      return new VoidWorkflowMapper<TWithdrawConnectionRequestParams>(
        "st.withdrawConnectionRequest",
      ) as TRestoreMapperReturnType<T>;
    }
    case "retrievePendingRequests": {
      return new RetrievePendingRequestsMapper() as TRestoreMapperReturnType<T>;
    }
    case "retrieveConnections": {
      return new RetrieveConnectionsMapper() as TRestoreMapperReturnType<T>;
    }
    case "removeConnection": {
      return new VoidWorkflowMapper<TRemoveConnectionParams>(
        "st.removeConnection",
      ) as TRestoreMapperReturnType<T>;
    }
    case "reactToPost": {
      return new VoidWorkflowMapper<TReactToPostParams>(
        "st.reactToPost",
      ) as TRestoreMapperReturnType<T>;
    }
    case "commentOnPost": {
      return new VoidWorkflowMapper<TCommentOnPostParams>(
        "st.commentOnPost",
      ) as TRestoreMapperReturnType<T>;
    }
    case "retrieveSSI": {
      return new SimpleWorkflowMapper<TBaseActionParams, TRetrieveSSIResult>({
        actionType: "st.retrieveSSI",
      }) as TRestoreMapperReturnType<T>;
    }
    case "retrievePerformance": {
      return new SimpleWorkflowMapper<
        TBaseActionParams,
        TRetrievePerformanceResult
      >({
        actionType: "st.retrievePerformance",
      }) as TRestoreMapperReturnType<T>;
    }
    case "executeCustomWorkflow": {
      return null as TRestoreMapperReturnType<T>;
    }
    default:
      throw new Error(`Unsupported functionName: ${functionName}`);
  }
}
