import { ContextInterface } from "./contracts/context.contract.js";
import { FrameworkFactory } from "./contracts/framework.contract.js";
import { RequestInterface } from "./contracts/request.contract.js";
import {
  ResponseInterface,
  StatusText,
} from "./contracts/response.contract.js";
import {
  HandleFn,
  NextFn,
  RouterInterface,
} from "./contracts/router.contract.js";
import { FrameworkError } from "./errors/framework.error.js";

function defaultNext(): Promise<ResponseInterface> {
  throw new FrameworkError(404, "route not found");
}

function normalizeStatusText(statusText: string): string {
  return statusText.replaceAll(/\s+/, "_").toLocaleLowerCase();
}

function handleError(): HandleFn {
  return async (context, next) => {
    try {
      return await next();
    } catch (error) {
      const statusCode =
        error instanceof FrameworkError ? error.statusCode : 500;
      const statusText = StatusText[statusCode];
      return context
        .respondWith(statusCode, statusText)
        .setHeader("Content-Type", "application/json")
        .setBody({
          error: normalizeStatusText(statusText),
          reason: (error as Error).message,
        });
    }
  };
}

export class Router implements RouterInterface {
  protected _factory: FrameworkFactory;

  protected _handlers: Array<HandleFn | RouterInterface> = [handleError()];

  public constructor(factory: FrameworkFactory) {
    this._factory = factory;
  }

  public dispatch(request: RequestInterface): Promise<ResponseInterface>;
  public dispatch(context: ContextInterface): Promise<ResponseInterface>;
  public dispatch(
    contextOrRequest: ContextInterface | RequestInterface,
    next?: NextFn,
  ): Promise<ResponseInterface> {
    const context = !("respondWith" in contextOrRequest)
      ? this._factory.createContext(contextOrRequest, this._factory)
      : contextOrRequest;
    const nextFn = typeof next !== "undefined" ? next : defaultNext;

    let index = 0;
    const lastIndex = this._handlers.length - 1;
    const _nextFn: NextFn = () => {
      if (index > lastIndex) return nextFn();
      const handler = this._handlers[index++];
      return "dispatch" in handler
        ? handler.dispatch(context, _nextFn)
        : handler(context, _nextFn);
    };
    return _nextFn();
  }

  public use(handler: RouterInterface | HandleFn): this {
    this._handlers.push(handler);
    return this;
  }

  protected _defaultHandler: HandleFn = () => {
    throw new FrameworkError(404, "route not found");
  };
}
