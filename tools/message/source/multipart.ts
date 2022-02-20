import { isReadable } from "@marubase-tools/stream";
import { Readable } from "stream";
import { MessageInterface } from "./contracts/message.contract.js";
import { MultipartInterface } from "./contracts/multipart.contract.js";
import { toMessage } from "./functions/to-message.js";
import { toMultiStream } from "./functions/to-multistream.js";

export class Multipart implements MultipartInterface {
  protected _boundary =
    Math.random().toString(36).slice(2) +
    Math.random().toString(36).slice(2) +
    Math.random().toString(36).slice(2);

  protected _parts: MessageInterface[] | Readable;

  protected _type = "multipart/mixed";

  public constructor(parts: MessageInterface[] | Readable) {
    this._parts = parts;
  }

  public get boundary(): string {
    return this._boundary;
  }

  public get stream(): Readable {
    if (isReadable(this._parts)) return this._parts;
    return new MultipartStream(this._boundary, this._parts);
  }

  public get type(): string {
    return this._type;
  }

  public [Symbol.asyncIterator](): AsyncIterator<MessageInterface> {
    if (isReadable(this._parts)) {
      const iterator = toMultiStream(this._boundary, this._parts);
      return {
        next: async (): Promise<IteratorResult<MessageInterface>> => {
          const cursor = await iterator.next();
          if (cursor.done) return { done: true, value: undefined };
          return { done: false, value: await toMessage(cursor.value) };
        },
      };
    } else {
      let cursor = 0;
      return {
        next: async (): Promise<IteratorResult<MessageInterface>> => {
          const part = (this._parts as MessageInterface[])[cursor++];
          return typeof part !== "undefined"
            ? { done: false, value: part }
            : { done: true, value: undefined };
        },
      };
    }
  }

  public setBoundary(boundary: string): this {
    this._boundary = boundary;
    return this;
  }

  public setType(type: string): this {
    this._type = type;
    return this;
  }
}

export class MultipartStream extends Readable {
  protected _boundary: string;

  protected _cursor = 0;

  protected _parts: MessageInterface[];

  protected _reader?: AsyncIterator<Buffer>;

  public constructor(boundary: string, parts: MessageInterface[]) {
    super();
    this._boundary = boundary;
    this._parts = parts;
  }

  public _read(): void {
    if (typeof this._reader !== "undefined") {
      this._reader.next().then(
        (chunk) => {
          if (chunk.done) delete this._reader;
          else this.push(chunk.value);
        },
        (error) => this.destroy(error),
      );
    } else {
      const part = this._parts[this._cursor++];
      if (typeof part === "undefined") {
        const ender = `\r\n--${this._boundary}--`;
        this.push(ender);
        this.push(null);
      } else {
        this._reader = part.stream[Symbol.asyncIterator]();

        const starter = `\r\n--${this._boundary}\r\n`;
        this.push(starter);
      }
    }
  }
}
