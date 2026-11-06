import type { TBaseActionParams } from '../params';

export interface TNvUnsaveLeadParams extends TBaseActionParams {
  personHashedUrl: string;
}
