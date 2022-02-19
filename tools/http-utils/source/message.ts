import { isReadableStream, toReadable } from "@marubase-tools/stream-utils";
import { Readable } from "stream";
import { MessageData, MessageInterface } from "./contracts/message.contract.js";
import { MultipartInterface } from "./contracts/multipart.contract.js";
import { isMultipart, Multipart } from "./multipart.js";

export class Message implements MessageInterface {
  protected _body?: MessageData | MultipartInterface | Readable;

  protected _headers = new Map<string, string>();

  public get body(): Readable {
    if (typeof this._body === "undefined") return toReadable([]);
    if (isMultipart(this._body)) return this._body.toStream();
    if (isReadableStream(this._body)) return this._body;

    const json = JSON.stringify(this._body);
    return toReadable(json);
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

  public setBody(body: MessageData | MultipartInterface | Readable): this {
    if (!this._headers.has("Content-Type")) {
      const contentType = isMultipart(body)
        ? body.contentType
        : isReadableStream(body)
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
    if (typeof this._body === "undefined") return null;
    if (isMultipart(this._body)) {
      const parts: MessageInterface[] = [];
      for await (const part of this._body) parts.push(part);
      return Promise.all(parts.map((part) => part.toData()));
    }
    if (isReadableStream(this._body)) {
      const chunks: Buffer[] = [];
      for await (const chunk of this._body) chunks.push(chunk);

      const buffer = Buffer.concat(chunks);
      if (this._headers.get("Content-Type") === "application/json") {
        const json = buffer.toString("utf8");
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

  public toMultipart(): MultipartInterface {
    const contentType =
      this._headers.get("Content-Type") || "application/octet-stream";
    if (!contentType.startsWith("multipart/")) {
      const context = `Converting body to multipart.`;
      const problem = `Body content type is not of multipart.`;
      const solution = `Please try again with correct content type.`;
      throw new Error(`${context} ${problem} ${solution}`);
    }
    return new Multipart(this._body as Readable);
  }

  public toStream(): Readable {
    return new MessageReadable(this._headers, this._body as Readable);
  }
}

export class MessageReadable extends Readable {
  protected _body: Readable;

  protected _headers: Map<string, string>;

  protected _reader?: AsyncIterator<Buffer>;

  public constructor(headers: Map<string, string>, body: Readable) {
    super();
    this._headers = headers;
    this._body = body;
  }

  public _read(): void {
    if (typeof this._reader !== "undefined") {
      this._reader.next().then(
        (chunk) => this.push(!chunk.done ? chunk.value : null),
        (error) => this.destroy(error),
      );
      return;
    }
    this._reader = this._body[Symbol.asyncIterator]();

    for (const [key, value] of [...this._headers.entries()].sort()) {
      const header = `${key}: ${value}\r\n`;
      this.push(header);
    }

    const separator = `\r\n`;
    this.push(separator);
  }
}

export async function toMessage(readable: Readable): Promise<MessageInterface> {
  const headers = new Map<string, string>();
  const reader = readable[Symbol.asyncIterator]();
  const separator = "\r\n\r\n";

  let buffer = Buffer.from([]);
  let chunk = await reader.next();
  for (; !chunk.done; chunk = await reader.next()) {
    buffer = Buffer.concat([buffer, chunk.value]);

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

  const body = new Readable({
    read() {
      reader.next().then(
        (chunk) => this.push(!chunk.done ? chunk.value : null),
        (error) => this.destroy(error),
      );
    },
  });
  body.push(buffer);
  return new Message().setHeaders(headers).setBody(body);
}
