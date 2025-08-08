import type { TBaseActionParams } from "../types/params";
import type {
  TWorkflowDefinition,
  TWorkflowResponse,
} from "../types/workflows";

export abstract class BaseMapper<TParams extends TBaseActionParams, TResult> {
  abstract mapRequest(params: TParams): TWorkflowDefinition;
  abstract mapResponse(response: TWorkflowResponse): TResult;
}

export interface TDefaultParameters {
  [key: string]: unknown;
}
