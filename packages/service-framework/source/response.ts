import { resolvable } from "@marubase/container";
import {
  ResponseCode,
  ResponseContract,
  StatusCode,
} from "./contracts/response.contract.js";
import { Message } from "./message.js";

@resolvable()
export class Response extends Message implements ResponseContract {
  protected _status: StatusCode = 200;

  protected _statusText = ResponseCode[200];

  public get status(): StatusCode {
    return this._status;
  }

  public get statusText(): string {
    return this._statusText;
  }

  public setStatus(status: StatusCode): this {
    this._status = status;
    this._statusText = ResponseCode[status];
    return this;
  }

  public setStatusText(statusText: string): this {
    this._statusText = statusText;
    return this;
  }
}
