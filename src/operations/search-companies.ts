import { Operation, TOperationName } from '../core';
import { ArrayWorkflowMapper } from '../mappers/array-workflow-mapper';
import { TSearchCompaniesParams, TSearchCompanyResult } from '../types';

export class SearchCompanies extends Operation<TSearchCompaniesParams, TSearchCompanyResult[]> {
  public override readonly operationName: TOperationName = 'searchCompanies';
  protected override readonly mapper = new ArrayWorkflowMapper<
    TSearchCompaniesParams,
    TSearchCompanyResult
  >('st.searchCompanies');
}
