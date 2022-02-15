import {
  MessageBody,
  ServiceMessageInterface,
} from "./contracts/service-message.contract.js";

export class ServiceMessage implements ServiceMessageInterface {
  protected _body: MessageBody;

  protected _headers: Record<string, string> = {};

  public get body(): MessageBody {
    return this._body;
  }

  public get headers(): Record<string, string> {
    return this._headers;
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

  public setBody(body: MessageBody): this {
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
