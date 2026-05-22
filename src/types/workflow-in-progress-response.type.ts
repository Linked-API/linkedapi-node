import { TWorkflowInProgressStatus, TWorkflowStatusResponse } from './workflows';

export type TWorkflowInProgressResponse = TWorkflowStatusResponse & {
  workflowStatus: TWorkflowInProgressStatus;
};
