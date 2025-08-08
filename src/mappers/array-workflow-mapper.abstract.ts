import { LinkedApiWorkflowError } from "../types/errors";
import type { TBaseActionParams } from "../types/params";
import type {
  TWorkflowDefinition,
  TWorkflowResponse,
} from "../types/workflows";
import type { BaseMapper } from "./base-mapper.abstract";

export interface TDefaultParameters {
  [key: string]: unknown;
}

export abstract class ArrayWorkflowMapper<
  TParams extends TBaseActionParams,
  TResult,
> implements BaseMapper<TParams, TResult[]>
{
  private readonly baseActionType: string;

  constructor({ baseActionType }: { baseActionType: string }) {
    this.baseActionType = baseActionType;
  }

  public mapRequest(params: TParams): TWorkflowDefinition {
    return {
      actionType: this.baseActionType,
      ...params,
    } as unknown as TWorkflowDefinition;
  }

  public mapResponse(response: TWorkflowResponse): TResult[] {
    if (!response.completion) {
      const { failure } = response;
      if (failure) {
        throw new LinkedApiWorkflowError(failure.reason, failure.message);
      }
      throw LinkedApiWorkflowError.unknownError();
    }

    const data = response.completion.data;

    if (Array.isArray(data)) {
      return data as TResult[];
    }

    return [data] as TResult[];
  }
}
