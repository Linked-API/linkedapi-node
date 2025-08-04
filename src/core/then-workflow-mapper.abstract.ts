import { LinkedApiWorkflowError } from "../types/errors";
import type { TBaseActionParams } from "../types/params";
import type {
  TThenAction,
  TWorkflowData,
  TWorkflowDefinition,
  TWorkflowResponse,
} from "../types/workflows";
import type { BaseMapper, TDefaultParameters } from "./base-mapper.abstract";

export interface TActionConfig {
  paramName: string;
  actionType: string;
  configSource?: string;
}

export interface TResponseMappingConfig {
  actionType: string;
  targetProperty: string;
}

export abstract class ThenWorkflowMapper<
  TParams extends TBaseActionParams,
  TResult,
> implements BaseMapper<TParams, TResult>
{
  private readonly actionConfigs: TActionConfig[];
  private readonly responseMappings: TResponseMappingConfig[];
  private readonly baseActionType: string;
  private readonly defaultParams: TDefaultParameters;

  constructor({
    actionConfigs,
    responseMappings,
    baseActionType,
    defaultParams,
  }: {
    actionConfigs: TActionConfig[];
    responseMappings: TResponseMappingConfig[];
    baseActionType: string;
    defaultParams?: TDefaultParameters;
  }) {
    this.actionConfigs = actionConfigs;
    this.responseMappings = responseMappings;
    this.baseActionType = baseActionType;
    this.defaultParams = defaultParams ?? {};
  }

  public mapRequest(params: TParams): TWorkflowDefinition {
    const then = this.buildThenForRequest(params);
    const clearParams = this.clearParams(params);

    return {
      actionType: this.baseActionType,
      ...this.defaultParams,
      ...clearParams,
      then,
    } as unknown as TWorkflowDefinition;
  }

  public mapResponse(response: TWorkflowResponse): TResult {
    if (!response.completion) {
      const { failure } = response;
      if (failure) {
        throw new LinkedApiWorkflowError(failure.reason, failure.message);
      }
      throw LinkedApiWorkflowError.unknownError();
    }

    const { data, error } = response.completion;
    if (error) {
      throw new LinkedApiWorkflowError(error.message, error.type);
    }
    if (data) {
      return this.mapThenFromResponse(data);
    }

    throw LinkedApiWorkflowError.unknownError();
  }

  private mapThenFromResponse(data: TWorkflowData): TResult {
    const result = { ...data };
    const thenActions = data.then;

    if (!thenActions) {
      return result as TResult;
    }

    for (const mapping of this.responseMappings) {
      if (Array.isArray(thenActions) && thenActions.length > 0) {
        const thenAction = thenActions.find(
          (action: TThenAction) => action.actionType === mapping.actionType,
        );
        if (thenAction) {
          (result as Record<string, unknown>)[mapping.targetProperty] =
            thenAction.data;
        }
      }
    }
    delete (result as Record<string, unknown>)["then"];
    return result as TResult;
  }

  private buildThenForRequest(params: TParams): unknown[] {
    return this.actionConfigs
      .filter((config) => this.shouldIncludeActionToRequest(params, config))
      .map((config) => this.buildRequestAction(params, config));
  }

  private clearParams(params: TParams): TParams {
    const cleanedParams = { ...params };
    for (const config of this.actionConfigs) {
      if (config.paramName in cleanedParams) {
        delete cleanedParams[config.paramName as keyof TParams];
      }
      if (config.configSource && config.configSource in cleanedParams) {
        delete cleanedParams[config.configSource as keyof TParams];
      }
    }

    return cleanedParams;
  }

  private shouldIncludeActionToRequest(
    params: TParams,
    config: TActionConfig,
  ): boolean {
    const paramValue = params[config.paramName as keyof TParams];
    return paramValue !== undefined && paramValue !== null;
  }

  private buildRequestAction(
    params: TParams,
    config: TActionConfig,
  ): Record<string, unknown> {
    return {
      actionType: config.actionType,
      ...(config.configSource
        ? (params[config.configSource as keyof TParams] as Record<
            string,
            unknown
          >)
        : {}),
    };
  }
}
