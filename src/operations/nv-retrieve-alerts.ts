import { Operation, TOperationName } from '../core';
import { ArrayWorkflowMapper } from '../mappers/array-workflow-mapper';
import { TNvAlert, TNvRetrieveAlertsParams } from '../types';

export class NvRetrieveAlerts extends Operation<TNvRetrieveAlertsParams, Array<TNvAlert>> {
  public override readonly operationName: TOperationName = 'nvRetrieveAlerts';
  protected override readonly mapper = new ArrayWorkflowMapper<TNvRetrieveAlertsParams, TNvAlert>(
    'nv.retrieveAlerts',
  );
}
