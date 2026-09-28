import { Operation, TOperationName } from '../core';
import { SimpleWorkflowMapper } from '../mappers';
import { TCreateRepostParams, TCreateRepostResult } from '../types';

export class CreateRepost extends Operation<TCreateRepostParams, TCreateRepostResult> {
  public override readonly operationName: TOperationName = 'createRepost';
  protected override readonly mapper = new SimpleWorkflowMapper<
    TCreateRepostParams,
    TCreateRepostResult
  >({
    actionType: 'st.createRepost',
  });
}
