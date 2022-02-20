import { isReadable, toReadable } from "@marubase-tools/stream";
import { Readable } from "stream";
import { MessageInterface } from "./contracts/message.contract.js";
import { MultipartInterface } from "./contracts/multipart.contract.js";
import { Message } from "./message.js";

export class Multipart implements MultipartInterface {
  public static create(
    boundary: string,
    parts: MessageInterface[],
    type = "multipart/mixed",
  ): Multipart {
    return new Multipart(parts).setBoundary(boundary).setType(type);
  }

  public static from(
    boundary: string,
    stream: Readable,
    type = "multipart/mixed",
  ): Multipart {
    return new Multipart(stream).setBoundary(boundary).setType(type);
  }

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
          return { done: false, value: await Message.from(cursor.value) };
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
          if (chunk.done) delete this._reader, this.push(Buffer.from([]));
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

export async function* toMultiStream(
  boundary: string,
  stream: Readable,
): AsyncIterableIterator<Readable> {
  const reader = stream[Symbol.asyncIterator]();
  const starter = `\r\n--${boundary}\r\n`;
  const ender = `\r\n--${boundary}--`;

  let buffer = Buffer.from([]);
  let chunk = await reader.next();
  for (; !chunk.done; chunk = await reader.next()) {
    buffer = Buffer.concat([buffer, chunk.value]);

    const starterIndex = buffer.indexOf(starter);
    const enderIndex = buffer.indexOf(ender);
    if (starterIndex >= 0 && enderIndex >= 0) {
      if (starterIndex > enderIndex) return;
      else break;
    } else if (starterIndex < 0 && enderIndex < 0) {
      continue;
    } else if (enderIndex >= 0) {
      return;
    } else if (starterIndex >= 0) {
      break;
    }
  }

  do {
    const starterIndex = buffer.indexOf(starter);
    const enderIndex = buffer.indexOf(ender);
    if (starterIndex >= 0 && enderIndex >= 0) {
      if (starterIndex > enderIndex) break;

      const part = buffer.subarray(starterIndex + starter.length, enderIndex);
      const partIndex = part.indexOf(starter);
      if (partIndex >= 0) {
        const chunk = part.subarray(0, partIndex);
        const readable = toReadable(chunk);
        buffer = buffer.subarray(starterIndex + starter.length + partIndex);
        yield readable;
      } else {
        const readable = toReadable(part);
        buffer = Buffer.from([]);
        yield readable;
      }
    } else if (starterIndex < 0 && enderIndex < 0) {
      break;
    } else if (enderIndex >= 0) {
      break;
    } else if (starterIndex >= 0) {
      const part = buffer.subarray(starterIndex + starter.length);
      const partIndex = part.indexOf(starter);
      if (partIndex >= 0) {
        const chunk = part.subarray(0, partIndex);
        const readable = toReadable(chunk);
        buffer = buffer.subarray(starterIndex + starter.length + partIndex);
        yield readable;
      } else {
        let nextPart: (error?: Error) => void;
        const partComplete = new Promise((resolve, reject) => {
          nextPart = (error?: Error): void =>
            typeof error !== "undefined" ? reject(error) : resolve(undefined);
        });

        const readable = new Readable({
          read() {
            reader.next().then(
              (chunk) => {
                if (chunk.done) {
                  const context = `Reading multipart body.`;
                  const problem = `Readable stream ended unexpectedly.`;
                  const solution = `Please try again.`;
                  const error = new Error(`${context} ${problem} ${solution}`);
                  this.destroy(error);
                  nextPart(error);
                } else {
                  buffer = Buffer.concat([buffer, chunk.value]);

                  const starterIndex = buffer.indexOf(starter);
                  const enderIndex = buffer.indexOf(ender);
                  if (starterIndex >= 0 && enderIndex >= 0) {
                    if (starterIndex > enderIndex) {
                      const chunk = buffer.subarray(0, enderIndex);
                      this.push(chunk), this.push(null);
                      buffer = Buffer.from([]);
                      nextPart();
                    } else {
                      const chunk = buffer.subarray(0, starterIndex);
                      this.push(chunk), this.push(null);
                      buffer = buffer.subarray(starterIndex);
                      nextPart();
                    }
                  } else if (starterIndex < 0 && enderIndex < 0) {
                    this.push(buffer);
                    buffer = Buffer.from([]);
                  } else if (enderIndex >= 0) {
                    const chunk = buffer.subarray(0, enderIndex);
                    this.push(chunk), this.push(null);
                    buffer = Buffer.from([]);
                    nextPart();
                  } else if (starterIndex >= 0) {
                    const chunk = buffer.subarray(0, starterIndex);
                    this.push(chunk), this.push(null);
                    buffer = buffer.subarray(0, starterIndex);
                    nextPart();
                  }
                }
              },
              (error) => this.destroy(error),
            );
          },
        });
        readable.push(part);
        buffer = Buffer.from([]);
        yield readable;
        await partComplete;
      }
    }
  } while (buffer.length > 0);
}
