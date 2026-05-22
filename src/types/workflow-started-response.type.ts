import { TWorkflowInProgressStatus } from './workflows';

export interface TWorkflowStartedResponse {
  workflowId: string;
  workflowStatus: TWorkflowInProgressStatus;
  message?: string;
}
