import { Readable } from "@marubase-tools/stream";

export const ServiceContentContract = Symbol("ServiceContentContract");

export interface ServiceContentInterface {
  readonly body: Readable;

  readonly headers: Record<string, string>;

  buffer(): Promise<Buffer>;

  clearBody(): this;

  clearHeader(key: string): this;

  clearHeaders(): this;

  data(): Promise<JsonData>;

  setBody(body: ContentBody): this;

  setHeader(key: string, value: string): this;

  setHeaders(headers: Record<string, string>): this;
}

export type ContentBody =
  | ArrayBuffer
  | Buffer
  | JsonData
  | NodeJS.TypedArray
  | Readable;

export type JsonData =
  | { [property: string]: JsonData }
  | JsonData[]
  | boolean
  | null
  | number
  | string;
