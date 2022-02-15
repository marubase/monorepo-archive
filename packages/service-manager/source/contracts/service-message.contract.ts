import { Readable } from "@marubase-tools/stream";

export const ServiceMessageContract = Symbol("MessageContract");

export interface ServiceMessageInterface {
  readonly body: Readable;

  readonly headers: Record<string, string>;

  buffer(): Promise<Buffer>;

  clearBody(): this;

  clearHeader(key: string): this;

  clearHeaders(): this;

  json(): Promise<MessageData>;

  setBody(body: Buffer | MessageData | Readable): this;

  setHeader(key: string, value: string): this;

  setHeaders(headers: Record<string, string>): this;
}

export type MessageData =
  | { [element: string]: MessageData }
  | MessageData[]
  | boolean
  | null
  | number
  | string;
