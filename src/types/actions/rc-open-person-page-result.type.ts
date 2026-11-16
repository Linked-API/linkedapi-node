import type { TRcPerson } from './rc-person.type';
import type { TRcRecruitingActivity } from './rc-recruiting-activity.type';

export interface TRcOpenPersonPageResult extends Partial<TRcPerson> {
  recruitingActivity?: TRcRecruitingActivity;
}
