import { PredefinedOperation, TOperationName } from '../core';
import { ThenWorkflowMapper } from '../mappers';
import { TNvOpenPersonPageParams, TNvOpenPersonPageResult } from '../types';

export class SalesNavigatorFetchPerson extends PredefinedOperation<
  TNvOpenPersonPageParams,
  TNvOpenPersonPageResult
> {
  protected override readonly functionName: TOperationName = 'salesNavigatorFetchPerson';
  protected override readonly mapper = new NvFetchPersonMapper();
}

export class NvFetchPersonMapper extends ThenWorkflowMapper<
  TNvOpenPersonPageParams,
  TNvOpenPersonPageResult
> {
  constructor() {
    super({
      actionConfigs: [],
      responseMappings: [],
      baseActionType: 'nv.openPersonPage',
      defaultParams: {
        basicInfo: true,
      },
    });
  }
}
