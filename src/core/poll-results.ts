import { LinkedApiError, TWorkflowCompletion, TWorkflowStatus } from '../types';

import { WaitForCompletionOptions } from './operation';

export async function pollWorkflowResult(
  workflowId: string,
  workflowResultFn: (workflowId: string) => Promise<TWorkflowStatus | TWorkflowCompletion>,
  options: WaitForCompletionOptions,
): Promise<TWorkflowCompletion> {
  const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  const { pollInterval = 5000, timeout = 24 * 60 * 60 * 1000 } = options;
  const startTime = Date.now();

  while (Date.now() - startTime < timeout) {
    const result = await workflowResultFn(workflowId);

    if (result !== 'running') {
      return result as TWorkflowCompletion;
    }

    await sleep(pollInterval);
  }
  throw new LinkedApiError(
    'workflowTimeout',
    `Workflow ${workflowId} did not complete within ${timeout}ms`,
  );
}
