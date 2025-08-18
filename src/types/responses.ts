export interface TLinkedApiResponse<TResult = unknown> {
  success: boolean;
  result?: TResult;
  error?: TLinkedApiRequestError;
}

export interface TLinkedApiRequestError {
  type: string;
  message: string;
}
