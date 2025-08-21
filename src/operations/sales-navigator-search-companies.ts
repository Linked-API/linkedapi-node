import { TSupportedFunctionName } from '../core';
import { PredefinedOperation } from '../core/base-operation.abstract';
import { ArrayWorkflowMapper } from '../mappers/array-workflow-mapper';
import { TNvSearchCompaniesParams, TNvSearchCompanyResult } from '../types';

export class SalesNavigatorSearchCompanies extends PredefinedOperation<
  TNvSearchCompaniesParams,
  TNvSearchCompanyResult[]
> {
  protected override readonly functionName: TSupportedFunctionName =
    'salesNavigatorSearchCompanies';
  protected override readonly mapper = new ArrayWorkflowMapper<
    TNvSearchCompaniesParams,
    TNvSearchCompanyResult
  >('nv.searchCompanies');
}
