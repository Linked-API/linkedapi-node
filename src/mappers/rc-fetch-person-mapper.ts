import type { TRcOpenPersonPageParams, TRcOpenPersonPageResult } from '../types';

import { ThenWorkflowMapper } from './then-workflow-mapper.abstract';

export class RcFetchPersonMapper extends ThenWorkflowMapper<
  TRcOpenPersonPageParams,
  TRcOpenPersonPageResult
> {
  constructor() {
    super({
      actionConfigs: [],
      responseMappings: [],
      baseActionType: 'rc.openPersonPage',
      defaultParams: {
        basicInfo: true,
      },
    });
  }
}
