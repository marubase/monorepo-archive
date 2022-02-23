import { isReadable, toReadable } from "@marubase-tools/stream";
import { Readable } from "stream";
import { parseMessage } from "./functions/parse-message.js";
import { MessageStream } from "./message-stream.js";
import { Multipart } from "./multipart.js";

export class Message {
  public static isMessage(input: unknown): input is Message {
    return (
      typeof input === "object" &&
      input !== null &&
      "body" in (input as Message) &&
      "headers" in (input as Message) &&
      "stream" in (input as Message) &&
      "buffer" in (input as Message) &&
      "clearBody" in (input as Message) &&
      "clearHeader" in (input as Message) &&
      "clearHeaders" in (input as Message) &&
      "json" in (input as Message) &&
      "multipart" in (input as Message) &&
      "setBody" in (input as Message) &&
      "setHeader" in (input as Message) &&
      "setHeaders" in (input as Message)
    );
  }

  public static async parse(stream: Readable): Promise<Message> {
    const [headers, body] = await parseMessage(stream);
    return new Message().setHeaders(headers).setBody(body);
  }

  protected _body?: Buffer | Multipart | Readable | { data: MessageData };

  protected _headers = new Map<string, string>();

  public get body(): Readable {
    if (Buffer.isBuffer(this._body)) {
      this._body = toReadable(this._body);
      return this._body;
    }

    if (Multipart.isMultipart(this._body)) {
      this._body = this._body.stream;
      return this._body;
    }

    if (isReadable(this._body)) {
      return this._body;
    }

    if (typeof this._body === "undefined") {
      this._body = toReadable([]);
      return this._body;
    }

    const { content_type, data } = this._body.data as MessageDataBinary;
    if (content_type !== "application/json") {
      const buffer = Buffer.from(data, "base64");
      this._body = toReadable(buffer);
      return this._body;
    }

    const json = JSON.stringify(this._body.data);
    this._body = toReadable(json);
    return this._body;
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

    if (Multipart.isMultipart(this._body)) {
      const chunks: Buffer[] = [];
      for await (const chunk of this._body.stream) chunks.push(chunk);

      this._body = Buffer.concat(chunks);
      return this._body;
    }

    if (isReadable(this._body)) {
      const chunks: Buffer[] = [];
      for await (const chunk of this._body) chunks.push(chunk);

      this._body = Buffer.concat(chunks);
      return this._body;
    }

    if (typeof this._body === "undefined") {
      this._body = Buffer.from([]);
      return this._body;
    }

    const { content_type, data } = this._body.data as MessageDataBinary;
    if (content_type !== "application/json") {
      this._body = Buffer.from(data, "base64");
      return this._body;
    }

    const json = JSON.stringify(this._body.data);
    this._body = Buffer.from(json);
    return this._body;
  }

  public clearBody(): this {
    this._headers.delete("Content-Type");
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
    if (Buffer.isBuffer(this._body)) {
      const content_type =
        this._headers.get("Content-Type") || "application/octet-stream";
      if (content_type !== "application/json") {
        const data = this._body.toString("base64");
        const length = this._body.length;
        this._body = { data: { content_type, data, length } };
        return this._body.data;
      }

      const json = this._body.toString("utf8");
      this._body = { data: JSON.parse(json) };
      return this._body.data;
    }

    if (Multipart.isMultipart(this._body)) {
      const messages: Promise<MessageData>[] = [];
      for await (const message of this._body) messages.push(message.json());

      this._body = { data: await Promise.all(messages) };
      return this._body.data;
    }

    if (isReadable(this._body)) {
      const chunks: Buffer[] = [];
      for await (const chunk of this._body) chunks.push(chunk);

      const content_type =
        this._headers.get("Content-Type") || "application/octet-stream";
      if (content_type !== "application/json") {
        const buffer = Buffer.concat(chunks);
        const data = buffer.toString("base64");
        const length = buffer.length;
        this._body = { data: { content_type, data, length } };
        return this._body.data;
      }

      const buffer = Buffer.concat(chunks);
      const json = buffer.toString("utf8");
      this._body = { data: JSON.parse(json) };
      return this._body.data;
    }

    if (typeof this._body === "undefined") {
      this._body = { data: null };
      return this._body.data;
    }

    return this._body;
  }

  public multipart(): Multipart {
    if (Multipart.isMultipart(this._body)) {
      return this._body;
    }

    const content_type = this._headers.get("Content-Type") || "multipart/mixed";
    const pattern = /^(multipart\/[0-9a-z]+);\s*boundary="?([0-9a-z]+)"?$/i;
    const match = content_type.match(pattern);
    if (match === null) {
      const context = `Parsing multipart stream.`;
      const problem = `Invalid content type.`;
      const solution = `Please try again with multipart content.`;
      throw new Error(`${context} ${problem} ${solution}`);
    }

    const [, type, boundary] = match;
    return new Multipart(this.stream)
      .setBoundary(boundary)
      .setMessage(this)
      .setType(type);
  }

  public setBody(buffer: MessageBuffer): this;
  public setBody(data: MessageData): this;
  public setBody(multipart: Multipart): this;
  public setBody(stream: Readable): this;
  public setBody(
    body: MessageBuffer | MessageData | Multipart | Readable,
  ): this {
    if (ArrayBuffer.isView(body)) {
      if (!this._headers.has("Content-Type"))
        this._headers.set("Content-Type", "application/octet-stream");

      const { buffer, byteLength, byteOffset } = body;
      this._body = Buffer.from(buffer, byteOffset, byteLength);
      return this;
    }

    if (body instanceof ArrayBuffer) {
      if (!this._headers.has("Content-Type"))
        this._headers.set("Content-Type", "application/octet-stream");

      this._body = Buffer.from(body);
      return this;
    }

    if (Multipart.isMultipart(body)) {
      const content_type = `${body.type}; boundary="${body.boundary}"`;
      this._headers.set("Content-Type", content_type);
      this._body = body.setMessage(this);
      return this;
    }

    if (isReadable(body)) {
      if (!this._headers.has("Content-Type"))
        this._headers.set("Content-Type", "application/octet-stream");

      this._body = body;
      return this;
    }

    this._headers.set("Content-Type", "application/json");
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

export type MessageBuffer = ArrayBuffer | NodeJS.TypedArray;

export type MessageData =
  | { [key: string]: MessageData }
  | MessageData[]
  | boolean
  | null
  | number
  | string;

export type MessageDataBinary = {
  content_type: string;
  data: string;
  length: number;
};
