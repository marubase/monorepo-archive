import {
  MessageContract,
  MessageHeaders,
} from "./contracts/message.contract.js";

export class Message implements MessageContract {
  protected _body: unknown;

  protected _headers: MessageHeaders = {};

  public get body(): unknown {
    return this._body;
  }

  public get headers(): MessageHeaders {
    return this._headers;
  }

  public setBody(body: unknown): this {
    this._body = body;
    return this;
  }

  public setHeaders(headers: MessageHeaders): this {
    this._headers = headers;
    return this;
  }
}
