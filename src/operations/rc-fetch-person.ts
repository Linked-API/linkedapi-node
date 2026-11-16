import { Operation, TOperationName } from '../core';
import { RcFetchPersonMapper } from '../mappers/rc-fetch-person-mapper';
import { TRcOpenPersonPageParams, TRcOpenPersonPageResult } from '../types';

export class RcFetchPerson extends Operation<TRcOpenPersonPageParams, TRcOpenPersonPageResult> {
  public override readonly operationName: TOperationName = 'rcFetchPerson';
  protected override readonly mapper = new RcFetchPersonMapper();
}
