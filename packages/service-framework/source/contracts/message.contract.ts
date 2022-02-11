export interface MessageContract {
  readonly body: unknown;

  readonly headers: MessageHeaders;

  setBody(body: unknown): this;

  setHeaders(headers: MessageHeaders): this;
}

export type MessageHeaders = Record<string, string>;
