export interface TLinkedApiResponse<TResult = unknown> {
  success: boolean;
  result?: TResult;
  error?: TRequestError;
}

export interface TRequestError {
  type: string;
  message: string;
}
