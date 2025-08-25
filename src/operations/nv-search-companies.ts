import { Operation, TOperationName } from '../core';
import { ArrayWorkflowMapper } from '../mappers/array-workflow-mapper';
import { TNvSearchCompaniesParams, TNvSearchCompanyResult } from '../types';

export class NvSearchCompanies extends Operation<
  TNvSearchCompaniesParams,
  TNvSearchCompanyResult[]
> {
  protected override readonly operationName: TOperationName = 'nvSearchCompanies';
  protected override readonly mapper = new ArrayWorkflowMapper<
    TNvSearchCompaniesParams,
    TNvSearchCompanyResult
  >('nv.searchCompanies');
}
