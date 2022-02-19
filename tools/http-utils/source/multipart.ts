import { isReadableStream, toReadable } from "@marubase-tools/stream-utils";
import { Readable } from "stream";
import { MessageInterface } from "./contracts/message.contract.js";
import { MultipartInterface } from "./contracts/multipart.contract.js";
import { toMessage } from "./message.js";

export class Multipart implements MultipartInterface {
  protected _body: MessageInterface[] | Readable;

  protected _boundary =
    Math.random().toString(36).slice(2) +
    Math.random().toString(36).slice(2) +
    Math.random().toString(36).slice(2);

  protected _subType = "mixed";

  public constructor(body: MessageInterface[] | Readable) {
    this._body = body;
  }

  public get boundary(): string {
    return this._boundary;
  }

  public get contentType(): string {
    return `multipart/${this._subType}; boundary=${this._boundary}`;
  }

  public get subType(): string {
    return this._subType;
  }

  public [Symbol.asyncIterator](): AsyncIterator<MessageInterface> {
    if (!isReadableStream(this._body)) {
      let cursor = 0;
      return {
        next: async () => {
          const part = (this._body as MessageInterface[])[cursor++];
          if (typeof part === "undefined")
            return { done: true, value: undefined };
          return { done: false, value: part };
        },
      };
    }

    const iterator = toMultipartIterator(this._boundary, this._body);
    return {
      next: async (): Promise<IteratorResult<MessageInterface>> => {
        const readable = await iterator.next();
        if (readable.done) return { done: true, value: undefined };
        return { done: false, value: await toMessage(readable.value) };
      },
    };
  }

  public setBoundary(boundary: string): this {
    this._boundary = boundary;
    return this;
  }

  public setSubType(subType: string): this {
    this._subType = subType;
    return this;
  }

  public toStream(): Readable {
    if (isReadableStream(this._body)) return this._body;
    return new MultipartReadable(this._boundary, this._body);
  }
}

export class MultipartReadable extends Readable {
  protected _boundary: string;

  protected _cursor = 0;

  protected _parts: MessageInterface[];

  protected _reader?: AsyncIterableIterator<Buffer>;

  public constructor(boundary: string, parts: MessageInterface[]) {
    super();
    this._boundary = boundary;
    this._parts = parts;
  }

  public _read(): void {
    if (typeof this._reader !== "undefined") {
      this._reader.next().then(
        (chunk) => {
          if (chunk.done) delete this._reader, this.push("\r\n");
          else this.push(chunk.value);
        },
        (error) => this.destroy(error),
      );
      return;
    }

    const part = this._parts[this._cursor++];
    if (typeof part === "undefined") {
      const ender = `--${this._boundary}--`;
      this.push(ender);
      this.push(null);
      return;
    }
    this._reader = part.toStream()[Symbol.asyncIterator]();

    const starter = `--${this._boundary}\r\n`;
    this.push(starter);
  }
}

export function isMultipart(input: unknown): input is MultipartInterface {
  return (
    typeof input === "object" &&
    input !== null &&
    Symbol.asyncIterator in (input as MultipartInterface) &&
    "setBoundary" in (input as MultipartInterface) &&
    "setSubType" in (input as MultipartInterface) &&
    "toStream" in (input as MultipartInterface)
  );
}

export async function* toMultipartIterator(
  boundary: string,
  readable: Readable,
): AsyncIterableIterator<Readable> {
  const reader = readable[Symbol.asyncIterator]();
  const starter = `--${boundary}\r\n`;
  const ender = `--${boundary}--`;

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
        let nextPart: Function;
        const partDone = new Promise((resolve) => (nextPart = resolve));

        const readable = new Readable({
          read() {
            reader.next().then(
              (chunk) => {
                if (chunk.done) {
                  const context = `Reading multipart body.`;
                  const problem = `Readable stream ended unexpectedly.`;
                  const solution = `Please try again.`;
                  this.destroy(new Error(`${context} ${problem} ${solution}`));
                  buffer = Buffer.from([]);
                  nextPart();
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
        await partDone;
      }
    }
  } while (buffer.length > 0);
}
