import { isReadable } from "@marubase-tools/stream";
import { Readable } from "stream";
import { parseMultipart } from "./functions/parse-multipart.js";
import { Message } from "./message.js";
import { MultipartStream } from "./multipart-stream.js";

export class Multipart implements AsyncIterable<Message> {
  public static isMultipart(input: unknown): input is Multipart {
    return (
      typeof input === "object" &&
      input !== null &&
      "boundary" in (input as Multipart) &&
      "type" in (input as Multipart) &&
      "setBoundary" in (input as Multipart) &&
      "setType" in (input as Multipart)
    );
  }

  protected _body: Message[] | Readable;

  protected _boundary =
    Math.random().toString(36).slice(2) +
    Math.random().toString(36).slice(2) +
    Math.random().toString(36).slice(2);

  protected _message?: Message;

  protected _type = "multipart/mixed";

  public constructor(message: Message[]);
  public constructor(stream: Readable);
  public constructor(body: Message[] | Readable) {
    this._body = body;
  }

  public get boundary(): string {
    return this._boundary;
  }

  public get message(): Message | undefined {
    return this._message;
  }

  public get stream(): Readable {
    if (isReadable(this._body)) return this._body;
    return new MultipartStream(this);
  }

  public get type(): string {
    return this._type;
  }

  public [Symbol.asyncIterator](): AsyncIterator<Message> {
    if (isReadable(this._body)) {
      const reader = parseMultipart(this._boundary, this._body);
      this._body = [];
      return {
        next: async () => {
          const readable = await reader.next();
          if (readable.done) return { done: true, value: undefined };

          const message = await Message.parse(readable.value);
          this._body.push(message);
          return { done: false, value: message };
        },
      };
    }

    let index = 0;
    return {
      next: async () => {
        const message = (this._body as Message[])[index++];
        return typeof message !== "undefined"
          ? { done: false, value: message }
          : { done: true, value: undefined };
      },
    };
  }

  public clearMessage(): this {
    delete this._message;
    return this;
  }

  public setBoundary(boundary: string): this {
    if (typeof this._message !== "undefined") {
      const content_type = `${this._type}; boundary="${boundary}"`;
      this._message.setHeader("Content-Type", content_type);
    }

    this._boundary = boundary;
    return this;
  }

  public setMessage(message: Message): this {
    this._message = message;
    return this;
  }

  public setType(type: string): this {
    if (typeof this._message !== "undefined") {
      const content_type = `${type}; boundary="${this._boundary}"`;
      this._message.setHeader("Content-Type", content_type);
    }

    this._type = type;
    return this;
  }
}
