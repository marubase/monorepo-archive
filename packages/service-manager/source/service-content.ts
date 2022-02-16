import { isReadable, Readable } from "@marubase-tools/stream";
import {
  ContentBody,
  JsonData,
  ServiceContentInterface,
} from "./contracts/service-content.contract.js";

export class ServiceContent implements ServiceContentInterface {
  protected _body?: Buffer | JsonData | Readable;

  protected _headers: Record<string, string> = {};

  public get body(): Readable {
    if (typeof this._body === "undefined") {
      return Readable.from([]);
    }
    if (Buffer.isBuffer(this._body)) {
      return Readable.from(this._body);
    }
    if (isReadable(this._body)) {
      return this._body;
    }
    const json = JSON.stringify(this._body);
    return Readable.from(json);
  }

  public get headers(): Record<string, string> {
    return this._headers;
  }

  public async buffer(): Promise<Buffer> {
    if (typeof this._body === "undefined") {
      return Buffer.from([]);
    }
    if (Buffer.isBuffer(this._body)) {
      return this._body;
    }
    if (isReadable(this._body)) {
      const chunks: Buffer[] = [];
      for await (const chunk of this._body) chunks.push(chunk);
      return Buffer.concat(chunks);
    }
    const json = JSON.stringify(this._body);
    return Buffer.from(json);
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

  public async data(): Promise<JsonData> {
    if (typeof this._body === "undefined") {
      return null;
    }
    if (Buffer.isBuffer(this._body)) {
      if (this._headers["Content-Type"] === "application/json") {
        const json = this._body.toString("utf8");
        return JSON.parse(json);
      }

      const content_type = this._headers["Content-Type"];
      const data = this._body.toString("base64");
      const length = this._body.length;
      return { content_type, data, length };
    }
    if (isReadable(this._body)) {
      const chunks: Buffer[] = [];
      for await (const chunk of this._body) chunks.push(chunk);

      const buffer = Buffer.concat(chunks);
      if (this._headers["Content-Type"] === "application/json") {
        const json = buffer.toString("utf8");
        return JSON.parse(json);
      }

      const content_type = this._headers["Content-Type"];
      const data = buffer.toString("base64");
      const length = buffer.length;
      return { content_type, data, length };
    }
    return this._body;
  }

  public setBody(body: ContentBody): this {
    if (!("Content-Type" in this._headers))
      this._headers["Content-Type"] =
        Buffer.isBuffer(body) || isReadable(body)
          ? "application/octet-stream"
          : "application/json";
    if (ArrayBuffer.isView(body)) {
      const { buffer, byteLength, byteOffset } = body;
      this._body = Buffer.from(buffer, byteOffset, byteLength);
      return this;
    }
    if (body instanceof ArrayBuffer) {
      this._body = Buffer.from(body);
      return this;
    }
    this._body = body;
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
