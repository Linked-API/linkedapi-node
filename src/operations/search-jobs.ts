import { Operation, TOperationName } from '../core';
import { ArrayWorkflowMapper } from '../mappers/array-workflow-mapper';
import { TSearchJobResult, TSearchJobsParams } from '../types';

export class SearchJobs extends Operation<TSearchJobsParams, TSearchJobResult[]> {
  public override readonly operationName: TOperationName = 'searchJobs';
  protected override readonly mapper = new ArrayWorkflowMapper<TSearchJobsParams, TSearchJobResult>(
    'st.searchJobs',
  );
}
