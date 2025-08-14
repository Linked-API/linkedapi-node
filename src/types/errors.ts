import { TSupportedFunctionName } from "../core/workflow-restoration";

/**
 * This error is thrown when a workflow fails to complete.
 * @see {@link https://linkedapi.io/docs/actions-overview/#result-options}
 */
export class LinkedApiWorkflowError extends Error {
  public reason: string;
  public override message: string;

  constructor(reason: string, message: string) {
    super(message);
    this.reason = reason;
    this.message = message;
  }

  public static unknownError(message: string = ""): LinkedApiWorkflowError {
    return new LinkedApiWorkflowError("unknownError", message);
  }
}

/**
 * This error is thrown when a request fails.
 * @see {@link https://linkedapi.io/docs/making-requests/#common-errors}
 */
export class LinkedApiError extends Error {
  public type: string;
  public override message: string;
  public details?: unknown;

  constructor(type: string, message: string, details?: unknown) {
    super(message);
    this.type = type;
    this.message = message;
    this.details = details;
  }
}

/**
 * This error is thrown when a workflow times out.
 */
export class LinkedApiWorkflowTimeoutError extends Error {
  public readonly workflowId: string;
  public readonly functionName: TSupportedFunctionName;

  constructor(workflowId: string, functionName: TSupportedFunctionName) {
    super(
      `Workflow ${workflowId} timed out. Use restoreWorkflow(${workflowId}, ${functionName}) to restore the workflow.`,
    );
    this.workflowId = workflowId;
    this.functionName = functionName;
  }
}
