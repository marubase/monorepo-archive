import { Context } from "./context.js";
import { RequestInterface } from "./contracts/request.contract.js";
import { ResponseInterface } from "./contracts/response.contract.js";
import {
  HandleFn,
  NextFn,
  RouterFactory,
  RouterInterface,
} from "./contracts/router.contract.js";
import { handleError } from "./handlers/handle-error.js";
import { Request } from "./request.js";
import { Response } from "./response.js";

export class Router implements RouterInterface {
  protected _factory: RouterFactory;

  protected _handlers: HandleFn[] = [handleError()];

  public constructor(factory = DefaultRouterFactory) {
    this._factory = factory;
  }

  public createRequest(): RequestInterface {
    return this._factory.createRequest();
  }

  public async dispatch(request: RequestInterface): Promise<ResponseInterface> {
    const response = this._factory.createResponse();
    const context = this._factory.createContext(request, response);

    let index = 0;
    const nextFn: NextFn = () => this._handlers[index++](context, nextFn);
    return nextFn();
  }

  public use(handler: HandleFn): this {
    this._handlers.push(handler);
    return this;
  }
}

export const DefaultRouterFactory: RouterFactory = {
  createContext: (request, response) => new Context(request, response),

  createRequest: () => new Request(),

  createResponse: () => new Response(),
};
