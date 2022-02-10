export interface MessageBuilderContract {
  readonly body: HttpBody;

  readonly headers: Headers;

  setBody(body: HttpBody): this;

  setHeaders(headers: HttpHeaders): this;
}

export type HttpBody =
  | Blob
  | BufferSource
  | FormData
  | URLSearchParams
  | ReadableStream
  | string;

export type HttpHeaders = Headers | Record<string, string> | [string, string][];
