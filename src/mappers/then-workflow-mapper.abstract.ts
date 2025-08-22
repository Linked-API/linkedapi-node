import { LinkedApiError, TLinkedApiActionError } from '../types/errors';
import type { TBaseActionParams } from '../types/params';
import type {
  TActionResponse,
  TWorkflowCompletion,
  TWorkflowDefinition,
  TWorkflowSingleData,
} from '../types/workflows';

import { BaseMapper, TDefaultParameters, TMappedResponse } from './base-mapper.abstract';

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
> extends BaseMapper<TParams, TResult> {
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
    super();
    this.actionConfigs = actionConfigs;
    this.responseMappings = responseMappings;
    this.baseActionType = baseActionType;
    this.defaultParams = defaultParams ?? {};
  }

  public override mapRequest(params: TParams): TWorkflowDefinition {
    const then = this.buildThenForRequest(params);
    const clearParams = this.clearParams(params);

    return {
      actionType: this.baseActionType,
      ...this.defaultParams,
      ...clearParams,
      then,
    } as unknown as TWorkflowDefinition;
  }

  public override mapResponse(completion: TWorkflowCompletion): TMappedResponse<TResult> {
    if (Array.isArray(completion)) {
      return {
        data: completion.map((action) => action.data).filter(Boolean) as TResult,
        errors: completion.map((action) => action.error).filter(Boolean) as TLinkedApiActionError[],
      };
    }

    if (completion.error) {
      return {
        data: undefined,
        errors: [completion.error].filter(Boolean) as TLinkedApiActionError[],
      };
    }
    if (completion.data) {
      return this.mapThenFromResponse(completion.data as TWorkflowSingleData);
    }

    throw LinkedApiError.unknownError();
  }

  private mapThenFromResponse(data: TWorkflowSingleData): TMappedResponse<TResult> {
    const result = { ...data };
    const thenActions = data.then;
    const errors: TLinkedApiActionError[] = [];

    if (!thenActions) {
      return {
        data: result as TResult,
        errors: [],
      };
    }

    for (const mapping of this.responseMappings) {
      if (Array.isArray(thenActions) && thenActions.length > 0) {
        const thenAction = thenActions.find(
          (action: TActionResponse) => action.actionType === mapping.actionType,
        );
        if (thenAction) {
          (result as Record<string, unknown>)[mapping.targetProperty] = thenAction.data;
          if (thenAction.error) {
            errors.push(thenAction.error);
          }
        }
        continue;
      }

      const thenAction = thenActions as TActionResponse;
      if (thenAction.actionType === mapping.actionType) {
        (result as Record<string, unknown>)[mapping.targetProperty] = thenAction.data;
        if (thenAction.error) {
          errors.push(thenAction.error);
        }
      }
    }
    delete (result as Record<string, unknown>)['then'];
    return {
      data: result as TResult,
      errors,
    };
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

  private shouldIncludeActionToRequest(params: TParams, config: TActionConfig): boolean {
    const paramValue = params[config.paramName as keyof TParams];
    return paramValue === true;
  }

  private buildRequestAction(params: TParams, config: TActionConfig): Record<string, unknown> {
    return {
      actionType: config.actionType,
      ...(config.configSource
        ? (params[config.configSource as keyof TParams] as Record<string, unknown>)
        : {}),
    };
  }
}
