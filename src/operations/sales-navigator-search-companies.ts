import { PredefinedOperation, TOperationName } from '../core';
import { ArrayWorkflowMapper } from '../mappers/array-workflow-mapper';
import { TNvSearchCompaniesParams, TNvSearchCompanyResult } from '../types';

export class SalesNavigatorSearchCompanies extends PredefinedOperation<
  TNvSearchCompaniesParams,
  TNvSearchCompanyResult[]
> {
  protected override readonly functionName: TOperationName = 'salesNavigatorSearchCompanies';
  protected override readonly mapper = new ArrayWorkflowMapper<
    TNvSearchCompaniesParams,
    TNvSearchCompanyResult
  >('nv.searchCompanies');
}
