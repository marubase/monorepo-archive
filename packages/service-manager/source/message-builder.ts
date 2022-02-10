import { ContainerContract } from "@marubase/container";
import {
  HttpBody,
  HttpHeaders,
  MessageBuilderContract,
} from "./contracts/message-builder.contract.js";

export class MessageBuilder implements MessageBuilderContract {
  protected _body: HttpBody = "";

  protected _container: ContainerContract;

  protected _headers = new Headers();

  public constructor(container: ContainerContract) {
    this._container = container;
  }

  public get body(): HttpBody {
    return this._body;
  }

  public get headers(): Headers {
    return this._headers;
  }

  public setBody(body: HttpBody): this {
    this._body = body;
    return this;
  }

  public setHeaders(headers: HttpHeaders): this {
    this._headers = !(headers instanceof Headers)
      ? new Headers(headers)
      : headers;
    return this;
  }
}
