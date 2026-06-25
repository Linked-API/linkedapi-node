import { Operation, TOperationName } from '../core';
import { TActionConfig, ThenWorkflowMapper, TResponseMappingConfig } from '../mappers';
import { TBaseFetchJobParams, TFetchJobResult } from '../types';

export class FetchJob extends Operation<TBaseFetchJobParams, TFetchJobResult> {
  public override readonly operationName: TOperationName = 'fetchJob';
  protected override readonly mapper = new FetchJobMapper();
}

const FETCH_JOB_ACTIONS: TActionConfig[] = [];

const RESPONSE_MAPPINGS: TResponseMappingConfig[] = [];

export class FetchJobMapper extends ThenWorkflowMapper<TBaseFetchJobParams, TFetchJobResult> {
  constructor() {
    super({
      actionConfigs: FETCH_JOB_ACTIONS,
      responseMappings: RESPONSE_MAPPINGS,
      baseActionType: 'st.openJob',
      defaultParams: {
        basicInfo: true,
      },
    });
  }
}
