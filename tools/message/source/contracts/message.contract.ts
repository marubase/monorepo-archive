import { Readable } from "stream";

export const MessageContract = Symbol("MessageContract");

export interface MessageInterface {
  readonly body: Readable;

  readonly headers: Map<string, string>;

  readonly stream: Readable;

  buffer(): Promise<Buffer>;

  clearBody(): this;

  clearHeader(key: string): this;

  clearHeaders(): this;

  json(): Promise<MessageData>;

  setBody(body: MessageBuffer | MessageData | Readable): this;

  setHeader(key: string, value: string): this;

  setHeaders(headers: Map<string, string> | [string, string][]): this;
}

export type MessageBuffer = ArrayBuffer | NodeJS.TypedArray;

export type MessageData =
  | { [key: string]: MessageData }
  | MessageData[]
  | boolean
  | null
  | number
  | string;
