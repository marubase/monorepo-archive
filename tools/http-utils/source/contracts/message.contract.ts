import { Readable } from "stream";
import { MultipartInterface } from "./multipart.contract.js";

export const MessageContract = Symbol("MessageContract");

export interface MessageInterface {
  readonly body: Readable;

  readonly headers: Map<string, string>;

  clearBody(): this;

  clearHeader(key: string): this;

  clearHeaders(): this;

  setBody(body: MessageData | MultipartInterface | Readable): this;

  setHeader(key: string, value: string): this;

  setHeaders(headers: Map<string, string>): this;

  toData(): Promise<MessageData>;

  toMultipart(): MultipartInterface;

  toStream(): Readable;
}

export type MessageData =
  | { [key: string]: MessageData }
  | MessageData[]
  | boolean
  | null
  | number
  | string;
