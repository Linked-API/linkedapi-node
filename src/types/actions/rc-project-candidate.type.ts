import type { TRcProjectStage } from './rc-project-stage.type';
import type { TRcSearchPeopleResult } from './rc-search-people-result.type';

export interface TRcProjectCandidate extends TRcSearchPeopleResult {
  stage: TRcProjectStage;
}
