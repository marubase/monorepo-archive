import { Readable } from "node:stream";

export const ServiceMessageContract = Symbol("MessageContract");

export interface ServiceMessageInterface {
  readonly body: MessageBody;

  readonly headers: Record<string, string>;

  clearBody(): this;

  clearHeader(key: string): this;

  clearHeaders(): this;

  setBody(body: MessageBody): this;

  setHeader(key: string, value: string): this;

  setHeaders(headers: Record<string, string>): this;
}

export type JSONData =
  | { [element: string]: JSONData }
  | JSONData[]
  | boolean
  | null
  | number
  | string;

export type MessageBody = Buffer | Readable | JSONData | undefined;
