import type { TBaseActionParams } from '../params';

export interface TRcSaveToProjectParams extends TBaseActionParams {
  personUrl: string;
  projectId: string;
}
