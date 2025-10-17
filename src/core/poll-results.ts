import { LinkedApiError, TWorkflowRunningStatus } from '../types';

import { WaitForCompletionOptions } from './operation';

export async function pollWorkflowResult<TResult>(
  workflowResultFn: () => Promise<TWorkflowRunningStatus | TResult>,
  options: WaitForCompletionOptions,
): Promise<TResult> {
  const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  const { pollInterval = 5000, timeout = 24 * 60 * 60 * 1000 } = options;
  const startTime = Date.now();

  let invalidAttempts = 0;
  const maxInvalidAttempts = 15;

  while (Date.now() - startTime < timeout) {
    try {
      const result = await workflowResultFn();

      if (result !== 'running') {
        return result;
      }
      invalidAttempts = 0;
    } catch (error) {
      if (error instanceof LinkedApiError && error.type === 'httpError') {
        invalidAttempts = invalidAttempts + 1;
        if (invalidAttempts > maxInvalidAttempts) {
          throw error;
        }
      } else {
        throw error;
      }
    }

    await sleep(pollInterval);
  }
  throw new LinkedApiError('workflowTimeout', `Workflow did not complete within ${timeout}ms`);
}
