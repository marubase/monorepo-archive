import { Readable } from "@marubase-tools/stream";
import {
  JsonData,
  ServiceContentInterface,
} from "./service-content.contract.js";

export const ServiceMultipartContract = Symbol("ServiceMultipartContract");

export interface ServiceMultipartInterface
  extends AsyncIterable<ServiceContentInterface> {
  readonly body: Readable;

  readonly boundary: string;

  readonly contentType: string;

  readonly type: string;

  buffer(): Promise<Buffer>;

  clearBody(): this;

  data(): Promise<JsonData>;

  setBody(body: Readable | ServiceContentInterface[]): this;

  setBoundary(boundary: string): this;

  setType(type: string): this;
}
