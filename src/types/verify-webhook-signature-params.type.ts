export interface TVerifyWebhookSignatureParams {
  rawBody: string | Buffer | Uint8Array | ArrayBuffer;
  timestamp: string | number | ReadonlyArray<string> | null | undefined;
  signature: string | ReadonlyArray<string> | null | undefined;
  secret: string | null | undefined;
  nowSeconds?: number;
  toleranceSeconds?: number;
}
