import { Readable } from "stream";
import { MessageInterface } from "./message.contract.js";

export const MultipartContract = Symbol("MultipartContract");

export interface MultipartInterface extends AsyncIterable<MessageInterface> {
  readonly boundary: string;

  readonly stream: Readable;

  readonly type: string;

  setBoundary(boundary: string): this;

  setType(type: string): this;
}