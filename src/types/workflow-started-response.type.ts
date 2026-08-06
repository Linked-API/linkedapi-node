import { TWorkflowPendingReason } from './workflow-pending-reason.type';
import { TWorkflowInProgressStatus } from './workflows';

export interface TWorkflowStartedResponse {
  workflowId: string;
  workflowStatus: TWorkflowInProgressStatus;
  message?: string;
  pendingReason?: TWorkflowPendingReason | null;
}
