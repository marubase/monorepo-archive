import { resolvable } from "@marubase/container";
import {
  RequestContract,
  RequestMethod,
} from "./contracts/request.contract.js";
import { Message } from "./message.js";

@resolvable()
export class Request extends Message implements RequestContract {
  protected _method: RequestMethod = "GET";

  protected _url = new URL("/", "http://127.0.0.1");

  public get method(): RequestMethod {
    return this._method;
  }

  public get url(): URL {
    return this._url;
  }

  public setMethod(method: RequestMethod): this {
    this._method = method;
    return this;
  }

  public setURL(url: string | URL, base?: string): this {
    this._url = new URL(url, base);
    return this;
  }
}
