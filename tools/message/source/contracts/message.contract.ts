import { Readable } from "stream";
import { MultipartInterface } from "./multipart.contract.js";

export const MessageContract = Symbol("MessageContract");

export interface MessageInterface {
  readonly body: Readable;

  readonly headers: Map<string, string>;

  readonly stream: Readable;

  buffer(): Promise<Buffer>;

  clearHeader(key: string): this;

  clearHeaders(): this;

  json(): Promise<MessageData>;

  multipart(): AsyncIterable<MessageInterface>;

  setBody(body: Readable): this;
  setBody(buffer: MessageBuffer): this;
  setBody(data: MessageData): this;
  setBody(multipart: MultipartInterface | MessageInterface[]): this;

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
