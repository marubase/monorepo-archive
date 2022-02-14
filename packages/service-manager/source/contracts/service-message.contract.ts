export const ServiceMessageContract = Symbol("MessageContract");

export interface ServiceMessageInterface {
  readonly body: unknown;

  readonly headers: Record<string, string>;

  clearBody(): this;

  clearHeader(key: string): this;

  clearHeaders(): this;

  setBody(body: unknown): this;

  setHeader(key: string, value: string): this;

  setHeaders(headers: Record<string, string>): this;
}
