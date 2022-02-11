import {
  MessageHeaders,
  MessageInterface,
} from "./contracts/message.contract.js";

export class Message implements MessageInterface {
  protected _body: unknown;

  protected _headers: MessageHeaders = {};

  public get body(): unknown {
    return this._body;
  }

  public get headers(): MessageHeaders {
    return this._headers;
  }

  public appendHeader(key: string, value: string[] | string): this {
    if (!(key in this._headers)) this._headers[key] = [];
    if (Array.isArray(value)) this._headers[key].push(...value);
    else this._headers[key].push(value);
    return this;
  }

  public clearHeader(key: string): this {
    delete this._headers[key];
    return this;
  }

  public getHeader(key: string): string[] | string | undefined {
    const values = this._headers[key];
    return typeof values !== "undefined"
      ? values.length < 2
        ? values[0]
        : values
      : undefined;
  }

  public hasHeader(key: string): boolean {
    return key in this._headers;
  }

  public setBody(body: unknown): this {
    this._body = body;
    return this;
  }

  public setHeader(key: string, value: string | string[]): this {
    this._headers[key] = !Array.isArray(value) ? [value] : value;
    return this;
  }
}
