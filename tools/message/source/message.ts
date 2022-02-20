import { isReadable, toReadable } from "@marubase-tools/stream";
import { Readable } from "stream";
import {
  MessageBuffer,
  MessageData,
  MessageInterface,
} from "./contracts/message.contract.js";

export class Message implements MessageInterface {
  public static create(
    body: MessageBuffer | MessageData | Readable,
    headers: Map<string, string> | [string, string][] = new Map(),
  ): Message {
    return new Message().setHeaders(headers).setBody(body);
  }

  public static async from(stream: Readable): Promise<Message> {
    const headers = new Map<string, string>();
    const reader = stream[Symbol.asyncIterator]();

    let buffer = Buffer.from([]);
    let chunk = await reader.next();
    for (; !chunk.done; chunk = await reader.next()) {
      buffer = Buffer.concat([buffer, chunk.value]);

      const separator = "\r\n\r\n";
      const separatorIndex = buffer.indexOf(separator);
      if (separatorIndex < 0) continue;

      const rawHeaders = buffer.subarray(0, separatorIndex).toString();
      for (const rawHeader of rawHeaders.split("\r\n")) {
        const [key, value] = rawHeader.split(":");
        headers.set(key.trim(), value.trim());
      }
      buffer = buffer.subarray(separatorIndex + separator.length);
      break;
    }

    const _body = new Readable({
      read() {
        reader.next().then(
          (chunk) => this.push(!chunk.done ? chunk.value : null),
          (error) => this.destroy(error),
        );
      },
    });
    _body.push(buffer);
    return new Message().setHeaders(headers).setBody(_body);
  }

  protected _body?: Buffer | Readable | { data: MessageData };

  protected _headers = new Map<string, string>();
  public get body(): Readable {
    if (Buffer.isBuffer(this._body)) {
      return toReadable(this._body);
    }

    if (isReadable(this._body)) {
      return this._body;
    }

    if (typeof this._body === "undefined") {
      return toReadable([]);
    }

    const json = JSON.stringify(this._body.data);
    return toReadable(json);
  }

  public get headers(): Map<string, string> {
    return this._headers;
  }

  public get stream(): Readable {
    return new MessageStream(this);
  }

  public async buffer(): Promise<Buffer> {
    if (Buffer.isBuffer(this._body)) {
      return this._body;
    }

    if (isReadable(this._body)) {
      const chunks: Buffer[] = [];
      for await (const chunk of this._body) chunks.push(chunk);
      return Buffer.concat(chunks);
    }

    if (typeof this._body === "undefined") {
      return Buffer.from([]);
    }

    const json = JSON.stringify(this._body.data);
    return Buffer.from(json);
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

  public async json(): Promise<MessageData> {
    const contentType =
      this._headers.get("Content-Type") || "application/octet-stream";
    if (Buffer.isBuffer(this._body)) {
      if (contentType === "application/json") {
        const json = this._body.toString("utf8");
        return JSON.parse(json);
      } else {
        const content_type = contentType;
        const data = this._body.toString("base64");
        const length = this._body.length;
        return { content_type, data, length };
      }
    }

    if (isReadable(this._body)) {
      const chunks: Buffer[] = [];
      for await (const chunk of this._body) chunks.push(chunk);

      const buffer = Buffer.concat(chunks);
      if (contentType === "application/json") {
        const json = buffer.toString("utf8");
        return JSON.parse(json);
      } else {
        const content_type = contentType;
        const data = buffer.toString("base64");
        const length = buffer.length;
        return { content_type, data, length };
      }
    }
    return typeof this._body !== "undefined" ? this._body.data : null;
  }

  public setBody(body: MessageData | MessageBuffer | Readable): this {
    if (!this._headers.has("Content-Type")) {
      const contentType =
        ArrayBuffer.isView(body) ||
        isReadable(body) ||
        body instanceof ArrayBuffer
          ? "application/octet-stream"
          : "application/json";
      this._headers.set("Content-Type", contentType);
    }

    if (ArrayBuffer.isView(body)) {
      const { buffer, byteLength, byteOffset } = body;
      this._body = Buffer.from(buffer, byteOffset, byteLength);
      return this;
    }

    if (body instanceof ArrayBuffer) {
      this._body = Buffer.from(body);
      return this;
    }

    if (isReadable(body)) {
      this._body = body;
      return this;
    }

    this._body = { data: body };
    return this;
  }

  public setHeader(key: string, value: string): this {
    this._headers.set(key, value);
    return this;
  }

  public setHeaders(headers: Map<string, string> | [string, string][]): this {
    this._headers = new Map(headers);
    return this;
  }
}

export class MessageStream extends Readable {
  protected _message: Message;

  protected _reader?: AsyncIterator<Buffer>;

  public constructor(message: Message) {
    super();
    this._message = message;
  }

  public _read(): void {
    if (typeof this._reader !== "undefined") {
      this._reader.next().then(
        (chunk) => this.push(!chunk.done ? chunk.value : null),
        (error) => this.destroy(error),
      );
    } else {
      this._reader = this._message.body[Symbol.asyncIterator]();

      for (const [key, value] of this._message.headers) {
        const header = `${key}: ${value}\r\n`;
        this.push(header);
      }

      const separator = "\r\n";
      this.push(separator);
    }
  }
}
