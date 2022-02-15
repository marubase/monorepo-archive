import { Readable } from "node:stream";
import {
  MessageData,
  ServiceMessageInterface,
} from "./contracts/service-message.contract.js";

export class ServiceMessage implements ServiceMessageInterface {
  protected _body?: Buffer | Readable | { data: MessageData };

  protected _headers: Record<string, string> = {};

  public get body(): Readable {
    if (typeof this._body === "undefined") return Readable.from([]);
    if (Buffer.isBuffer(this._body)) return Readable.from(this._body);
    return !("read" in this._body)
      ? Readable.from(JSON.stringify(this._body.data))
      : this._body;
  }

  public get headers(): Record<string, string> {
    return this._headers;
  }

  public async buffer(): Promise<Buffer> {
    if (typeof this._body === "undefined") return Buffer.from([]);
    if ("read" in this._body) {
      const chunks: Buffer[] = [];
      for await (const chunk of this._body) chunks.push(chunk);
      return Buffer.concat(chunks);
    }
    return !Buffer.isBuffer(this._body)
      ? Buffer.from(JSON.stringify(this._body.data))
      : this._body;
  }

  public clearBody(): this {
    delete this._body;
    return this;
  }

  public clearHeader(key: string): this {
    delete this._headers[key];
    return this;
  }

  public clearHeaders(): this {
    this._headers = {};
    return this;
  }

  public async data(): Promise<MessageData> {
    if (typeof this._body === "undefined") return null;
    if ("read" in this._body) {
      const chunks: Buffer[] = [];
      for await (const chunk of this._body) chunks.push(chunk);
      const buffer = Buffer.concat(chunks);
      return buffer.length > 0
        ? JSON.parse(Buffer.concat(chunks).toString("utf8"))
        : null;
    }
    return Buffer.isBuffer(this._body)
      ? this._body.length > 0
        ? JSON.parse(this._body.toString("utf8"))
        : null
      : this._body.data;
  }

  public setBody(body: Readable): this {
    this._body = body;
    return this;
  }

  public setBuffer(buffer: Buffer): this {
    this._body = buffer;
    return this;
  }

  public setData(data: MessageData): this {
    this._body = { data };
    return this;
  }

  public setHeader(key: string, value: string): this {
    this._headers[key] = value;
    return this;
  }

  public setHeaders(headers: Record<string, string>): this {
    this._headers = headers;
    return this;
  }
}
