import { LinkedApiWorkflowError } from "../types/errors";
import type { TBaseActionParams } from "../types/params";
import type {
  TWorkflowDefinition,
  TWorkflowResponse,
} from "../types/workflows";
import type { BaseMapper } from "./base-mapper.abstract";

export class VoidWorkflowMapper<TParams extends TBaseActionParams>
  implements BaseMapper<TParams, void>
{
  private readonly actionType: string;

  constructor(actionType: string) {
    this.actionType = actionType;
  }

  public mapRequest(params: TParams): TWorkflowDefinition {
    return {
      actionType: this.actionType,
      ...params,
    } as unknown as TWorkflowDefinition;
  }

  public mapResponse(response: TWorkflowResponse): void {
    if (!response.completion) {
      const { failure } = response;
      if (failure) {
        throw new LinkedApiWorkflowError(failure.reason, failure.message);
      }
      throw LinkedApiWorkflowError.unknownError();
    }
    return;
  }
}
