import { Readable } from "@marubase-tools/stream";
import {
  ContentBody,
  JsonData,
  ServiceContentInterface,
} from "./service-content.contract.js";
import { ServiceMultipartInterface } from "./service-multipart.contract.js";

export const ServiceMessageContract = Symbol("ServiceMessageContract");

export interface ServiceMessageInterface {
  readonly body: Readable;

  readonly headers: Record<string, string>;

  buffer(): Promise<Buffer>;

  clearBody(): this;

  clearHeader(key: string): this;

  clearHeaders(): this;

  json(): Promise<JsonData>;

  multipart(): ServiceMultipartInterface;

  setBody(body: MessageBody): this;

  setHeader(key: string, value: string): this;

  setHeaders(headers: Record<string, string>): this;
}

export type MessageBody =
  | ContentBody
  | ServiceContentInterface
  | ServiceMultipartInterface;
