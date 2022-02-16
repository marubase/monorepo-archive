import { Readable } from "@marubase-tools/stream";
import {
  ContentBody,
  JsonData,
  ServiceContentInterface,
} from "./service-content.contract.js";

export const ServiceMultipartContract = Symbol("ServiceMultipartContract");

export interface ServiceMultipartInterface
  extends AsyncIterable<ServiceContentInterface> {
  readonly body: Readable;

  readonly boundary: string;

  readonly type: string;

  append(content: ContentBody): this;

  buffer(): Promise<Buffer>;

  clearBody(): this;

  json(): Promise<JsonData>;

  setBoundary(boundary: string): this;

  setType(type: string): this;
}
