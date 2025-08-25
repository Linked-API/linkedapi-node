import { LinkedApiError, TWorkflowRunningStatus } from '../types';

import { WaitForCompletionOptions } from './operation';

export async function pollWorkflowResult<TResult>(
  workflowResultFn: () => Promise<TWorkflowRunningStatus | TResult>,
  options: WaitForCompletionOptions,
): Promise<TResult> {
  const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  const { pollInterval = 5000, timeout = 24 * 60 * 60 * 1000 } = options;
  const startTime = Date.now();

  while (Date.now() - startTime < timeout) {
    const result = await workflowResultFn();

    if (result !== 'running') {
      return result;
    }

    await sleep(pollInterval);
  }
  throw new LinkedApiError('workflowTimeout', `Workflow did not complete within ${timeout}ms`);
}
