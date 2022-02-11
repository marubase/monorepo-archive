export const MessageContract = Symbol("MessageContract");

export interface MessageInterface {
  readonly body: unknown;

  readonly headers: MessageHeaders;

  clearHeader(key: string): this;

  getHeader(key: string): string[] | string | undefined;

  hasHeader(key: string): boolean;

  setBody(body: unknown): this;

  setHeader(key: string, value: string[] | string): this;
}

export type MessageHeaders = Record<string, string[]>;
