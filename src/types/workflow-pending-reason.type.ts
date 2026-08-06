/**
 * Why a workflow is still pending rather than running.
 *
 * - `queued` — waiting its turn behind other work on the same LinkedIn account.
 * - `outsideWorkingHours` — the account has working hours configured with the `pending` off-hours
 *   policy, and the workflow starts automatically once the window reopens.
 */
export const LINKED_API_WORKFLOW_PENDING_REASON = {
  queued: 'queued',
  outsideWorkingHours: 'outsideWorkingHours',
} as const;

export type TWorkflowPendingReason =
  (typeof LINKED_API_WORKFLOW_PENDING_REASON)[keyof typeof LINKED_API_WORKFLOW_PENDING_REASON];
