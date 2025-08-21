import { TSupportedFunctionName } from '../core';
import { PredefinedOperation } from '../core/base-operation.abstract';
import { ArrayWorkflowMapper } from '../mappers/array-workflow-mapper';
import { TSearchCompaniesParams, TSearchCompanyResult } from '../types';

export class SearchCompanies extends PredefinedOperation<
  TSearchCompaniesParams,
  TSearchCompanyResult[]
> {
  protected override readonly functionName: TSupportedFunctionName = 'searchCompanies';
  protected override readonly mapper = new ArrayWorkflowMapper<
    TSearchCompaniesParams,
    TSearchCompanyResult
  >('st.searchCompanies');
}
