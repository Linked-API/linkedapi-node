import type { TBaseActionParams } from '../params';

export interface TRcRenameProjectParams extends TBaseActionParams {
  projectId: string;
  name: string;
  description?: string;
}
