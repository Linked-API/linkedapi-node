import { Operation, TOperationName } from '../core';
import { ThenWorkflowMapper } from '../mappers';
import { TNvOpenPersonPageParams, TNvOpenPersonPageResult } from '../types';

export class NvFetchPerson extends Operation<TNvOpenPersonPageParams, TNvOpenPersonPageResult> {
  public override readonly operationName: TOperationName = 'nvFetchPerson';
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
