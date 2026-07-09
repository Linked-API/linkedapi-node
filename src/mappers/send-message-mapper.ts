import { TSendMessageParams } from '../types';
import { TLinkedApiActionError } from '../types/errors';
import type {
  TActionResponse,
  TWorkflowCompletion,
  TWorkflowDefinition,
  TWorkflowSingleData,
} from '../types/workflows';

import { BaseMapper, TMappedResponse } from './base-mapper.abstract';

export class SendMessageMapper extends BaseMapper<TSendMessageParams, void> {
  public mapRequest(params: TSendMessageParams): TWorkflowDefinition {
    const { manageConversation, ...rest } = params;

    const definition: Record<string, unknown> = {
      actionType: 'st.sendMessage',
      ...rest,
    };

    // The child st.manageConversation acts on the conversation this message was sent into, so it
    // carries only `operation` — no threadId. Core rejects a threadId on a child manageConversation.
    // Guard on `operation` so an empty passthrough (e.g. Make sending `{ operation: '' }`) is ignored.
    if (manageConversation?.operation) {
      definition.then = {
        actionType: 'st.manageConversation',
        operation: manageConversation.operation,
      };
    }

    return definition as unknown as TWorkflowDefinition;
  }

  public mapResponse(completion: TWorkflowCompletion): TMappedResponse<void> {
    if (Array.isArray(completion)) {
      return {
        data: undefined,
        errors: completion.map((action) => action.error).filter(Boolean) as TLinkedApiActionError[],
      };
    }

    const errors: TLinkedApiActionError[] = [];

    if (completion.error) {
      errors.push(completion.error);
    }

    const thenActions = (completion.data as TWorkflowSingleData | undefined)?.then;
    if (thenActions) {
      const childActions = Array.isArray(thenActions) ? thenActions : [thenActions];
      for (const child of childActions as TActionResponse[]) {
        if (child.error) {
          errors.push(child.error);
        }
      }
    }

    return {
      data: undefined,
      errors,
    };
  }
}
