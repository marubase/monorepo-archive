import { isReadableStream, Readable } from "@marubase-tools/stream";
import { MessageData, MessageInterface } from "./contracts/message.contract.js";

export class Message implements MessageInterface {
  public static async fromStream(stream: Readable): Promise<Message> {
    const headers = new Map<string, string>();
    const iterator = stream[Symbol.asyncIterator]();

    let buffer = Buffer.from([]);
    for (
      let result = await iterator.next();
      !result.done;
      result = await iterator.next()
    ) {
      buffer = Buffer.concat([buffer, result.value]);

      const newline = buffer.indexOf("\r\n\r\n");
      if (newline < 0) continue;

      const rawHeaders = buffer.subarray(0, newline).toString();
      for (const rawHeader of rawHeaders.split("\r\n")) {
        const [key, value] = rawHeader.split(":");
        headers.set(key.trim(), value.trim());
      }

      buffer = buffer.subarray(newline + 4);
      break;
    }

    const body = new Readable({
      read() {
        iterator.next().then(
          (result) => this.push(!result.done ? result.value : null),
          (error) => this.destroy(error),
        );
      },
    });
    body.push(buffer);
    return new Message().setHeaders(headers).setBody(body);
  }

  protected _body?: MessageData | Readable;

  protected _headers = new Map<string, string>();

  public get body(): Readable {
    if (typeof this._body === "undefined") {
      return Readable.create([]);
    }

    if (isReadableStream(this._body)) {
      return this._body;
    }

    const json = JSON.stringify(this._body);
    this._headers.set("Content-Length", json.length.toString());
    return Readable.create(json);
  }

  public get headers(): Map<string, string> {
    return this._headers;
  }

  public clearBody(): this {
    delete this._body;
    return this;
  }

  public clearHeader(key: string): this {
    this._headers.delete(key);
    return this;
  }

  public clearHeaders(): this {
    this._headers.clear();
    return this;
  }

  public setBody(body: MessageData | Readable): this {
    if (!this._headers.has("Content-Type")) {
      const contentType = isReadableStream(body)
        ? "application/octet-stream"
        : "application/json";
      this._headers.set("Content-Type", contentType);
    }
    this._body = body;
    return this;
  }

  public setHeader(key: string, value: string): this {
    this._headers.set(key, value);
    return this;
  }

  public setHeaders(headers: Map<string, string>): this {
    this._headers = new Map(headers);
    return this;
  }

  public async toData(): Promise<MessageData> {
    if (typeof this._body === "undefined") {
      return null;
    }

    if (isReadableStream(this._body)) {
      const chunks: Buffer[] = [];
      for await (const chunk of this._body) chunks.push(chunk);

      const buffer = Buffer.concat(chunks);
      if (this._headers.get("Content-Type") === "application/json") {
        const json = buffer.toString();
        return JSON.parse(json);
      }

      const content_type =
        this._headers.get("Content-Type") || "application/octet-stream";
      const data = buffer.toString("base64");
      const length = buffer.length;
      return { content_type, data, length };
    }

    return this._body;
  }

  public toStream(): Readable {
    return new MessageStream(this);
  }
}

export class MessageStream extends Readable {
  protected _iterator?: AsyncIterator<Buffer>;

  protected _message: MessageInterface;

  public constructor(message: MessageInterface) {
    super();
    this._message = message;
  }

  public _read(): void {
    if (typeof this._iterator !== "undefined") {
      this._iterator.next().then(
        (result) => this.push(!result.done ? result.value : null),
        (error) => this.destroy(error),
      );
      return;
    }
    this._iterator = this._message.body[Symbol.asyncIterator]();

    for (const [key, value] of [...this._message.headers.entries()].sort()) {
      const header = `${key}: ${value}\r\n`;
      this.push(header);
    }

    const newline = `\r\n`;
    this.push(newline);
  }
}
