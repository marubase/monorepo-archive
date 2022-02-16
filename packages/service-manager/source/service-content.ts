import { isReadable, Readable } from "@marubase-tools/stream";
import {
  MessageData,
  ServiceContentInterface,
} from "./contracts/service-content.contract.js";

export class ServiceContent implements ServiceContentInterface {
  protected _body?: Buffer | Readable | { data: MessageData };

  protected _headers: Record<string, string> = {};

  public get body(): Readable {
    if (typeof this._body === "undefined") return Readable.from([]);
    if (Buffer.isBuffer(this._body)) return Readable.from(this._body);
    return !isReadable(this._body)
      ? Readable.from(JSON.stringify(this._body.data))
      : this._body;
  }

  public get headers(): Record<string, string> {
    return this._headers;
  }

  public async buffer(): Promise<Buffer> {
    if (typeof this._body === "undefined") return Buffer.from([]);
    if (isReadable(this._body)) {
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

  public async json(): Promise<MessageData> {
    if (typeof this._body === "undefined") return null;
    if (isReadable(this._body)) {
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

  public setBody(body: Buffer | MessageData | Readable): this {
    if (Buffer.isBuffer(body) || isReadable(body)) this._body = body;
    else this._body = { data: body };
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
