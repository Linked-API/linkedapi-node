import { Operation, TOperationName } from '../core';
import { ArrayWorkflowMapper } from '../mappers/array-workflow-mapper';
import { TProfileViewer, TRetrieveProfileViewersParams } from '../types';

export class RetrieveProfileViewers extends Operation<
  TRetrieveProfileViewersParams,
  Array<TProfileViewer>
> {
  public override readonly operationName: TOperationName = 'retrieveProfileViewers';
  protected override readonly mapper = new ArrayWorkflowMapper<
    TRetrieveProfileViewersParams,
    TProfileViewer
  >('st.retrieveProfileViewers');
}
