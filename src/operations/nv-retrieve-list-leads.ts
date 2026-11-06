import { Operation, TOperationName } from '../core';
import { ArrayWorkflowMapper } from '../mappers';
import { TNvListLead, TNvRetrieveListLeadsParams } from '../types';

/** Retrieve list leads from an owned Sales Navigator list. */
export class NvRetrieveListLeads extends Operation<TNvRetrieveListLeadsParams, Array<TNvListLead>> {
  public override readonly operationName: TOperationName = 'nvRetrieveListLeads';
  protected override readonly mapper = new ArrayWorkflowMapper<
    TNvRetrieveListLeadsParams,
    TNvListLead
  >('nv.retrieveListLeads');
}
