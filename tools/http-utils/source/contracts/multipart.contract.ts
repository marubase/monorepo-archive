import { Readable } from "stream";
import { MessageInterface } from "./message.contract.js";

export const MultipartContract = Symbol("MultipartContract");

export interface MultipartInterface extends AsyncIterable<MessageInterface> {
  readonly boundary: string;

  readonly contentType: string;

  readonly subType: string;

  setBoundary(boundary: string): this;

  setSubType(subType: string): this;

  toStream(): Readable;
}
