import { Readable, ReadableOptions } from "stream";
import { Message } from "./message.js";

export class MessageStream extends Readable {
  protected _message: Message;

  protected _reader?: AsyncIterator<Buffer>;

  public constructor(message: Message, options?: ReadableOptions) {
    super({ ...options, encoding: undefined, objectMode: false });
    this._message = message;
  }

  public _read(): void {
    if (typeof this._reader !== "undefined") {
      this._reader.next().then(
        (chunk) => (!chunk.done ? this.push(chunk.value) : this.push(null)),
        (error) => this.destroy(error),
      );
    } else {
      const { body, headers } = this._message;
      this._reader = body[Symbol.asyncIterator]();

      for (const [key, value] of [...headers.entries()].sort()) {
        const rawHeader = `${key}: ${value}\r\n`;
        this.push(rawHeader);
      }

      const separator = `\r\n`;
      this.push(separator);
    }
  }
}
