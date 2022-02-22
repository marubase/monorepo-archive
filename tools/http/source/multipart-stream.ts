import { Readable, ReadableOptions } from "stream";
import { Message } from "./message.js";
import { Multipart } from "./multipart.js";

export class MultipartStream extends Readable {
  protected _iterator: AsyncIterator<Message>;

  protected _multipart: Multipart;

  protected _reader?: AsyncIterator<Buffer>;

  public constructor(multipart: Multipart, options?: ReadableOptions) {
    super({ ...options, encoding: undefined, objectMode: false });
    this._multipart = multipart;
    this._iterator = multipart[Symbol.asyncIterator]();
  }

  public _read(): void {
    if (typeof this._reader !== "undefined") {
      this._reader.next().then(
        (chunk) => {
          if (chunk.done) delete this._reader, this.push(Buffer.from("\r\n"));
          else this.push(chunk.value);
        },
        (error) => this.destroy(error),
      );
    } else {
      this._iterator.next().then(
        (message) => {
          if (message.done) {
            const ender = `--${this._multipart.boundary}--`;
            this.push(ender);
            this.push(null);
          } else {
            this._reader = message.value.stream[Symbol.asyncIterator]();

            const starter = `--${this._multipart.boundary}\r\n`;
            this.push(starter);
          }
        },
        (error) => this.destroy(error),
      );
    }
  }
}
