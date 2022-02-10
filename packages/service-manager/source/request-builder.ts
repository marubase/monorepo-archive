import {
  HttpRequestMethod,
  RequestBuilderContract,
} from "./contracts/request-builder.contract.js";
import { MessageBuilder } from "./message-builder.js";

export class RequestBuilder
  extends MessageBuilder
  implements RequestBuilderContract
{
  protected _method: HttpRequestMethod = "GET";

  protected _url = new URL("/", "http://127.0.0.1/");

  public get method(): HttpRequestMethod {
    return this._method;
  }

  public get url(): URL {
    return this._url;
  }

  public build(): Request {
    return this._container.resolve("lib:response", this._url.toString(), {
      body: this._body,
      headers: this._headers,
      method: this._method,
    });
  }

  public setMethod(method: HttpRequestMethod): this {
    this._method = method;
    return this;
  }

  public setUrl(url: URL | string, base?: string): this {
    this._url = !(url instanceof URL) ? new URL(url, base) : url;
    return this;
  }
}
