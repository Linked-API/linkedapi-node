import type { TBaseActionParams } from '../params';

export interface TRcOpenPersonPageParams extends TBaseActionParams {
  personUrl: string;
  /** Defaults to true in rcFetchPerson. Set false to open the profile without reading its details. */
  basicInfo?: boolean;
  recruitingActivity?: boolean;
}
