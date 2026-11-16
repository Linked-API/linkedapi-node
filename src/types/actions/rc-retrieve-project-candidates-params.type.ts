import type { TLimitParams } from '../params';

import type { TRcProjectStage } from './rc-project-stage.type';

export interface TRcRetrieveProjectCandidatesParams extends TLimitParams {
  projectId: string;
  stage?: TRcProjectStage;
}
