import { match } from "path-to-regexp";
import { ContextInterface } from "./contracts/context.contract.js";
import { ManagerFactory } from "./contracts/manager.contract.js";
import { RequestInterface } from "./contracts/request.contract.js";
import {
  ResponseInterface,
  StatusText,
} from "./contracts/response.contract.js";
import {
  HandleFn,
  NextFn,
  RouterInterface,
  RouterOptions,
} from "./contracts/router.contract.js";
import { ServiceError } from "./errors/service.error.js";

export const FIXED_ROUTER_OPTIONS = {
  decode: decodeURIComponent,
  encode: encodeURIComponent,
};

export class Router implements RouterInterface {
  protected _factory: ManagerFactory;

  protected _handlers: Array<HandleFn | RouterInterface> = [
    this._handleError(),
  ];

  protected _options: RouterOptions;

  public constructor(factory: ManagerFactory, options: RouterOptions) {
    this._factory = factory;
    this._options = Object.assign(options, FIXED_ROUTER_OPTIONS);
  }

  public dispatch(request: RequestInterface): Promise<ResponseInterface>;
  public dispatch(
    context: ContextInterface,
    next: NextFn,
  ): Promise<ResponseInterface>;
  public dispatch(
    contextOrRequest: ContextInterface | RequestInterface,
    next?: NextFn,
  ): Promise<ResponseInterface> {
    const _context = !("respondWith" in contextOrRequest)
      ? this._factory.createContext(contextOrRequest, this._factory)
      : contextOrRequest;
    const _next = typeof next === "undefined" ? this._defaultNext : next;

    let _index = 0;
    const _lastIndex = this._handlers.length - 1;
    const _nextFn: NextFn = (): Promise<ResponseInterface> => {
      if (_index > _lastIndex) return _next();
      const handler = this._handlers[_index++];
      return "dispatch" in handler
        ? handler.dispatch(_context, _nextFn)
        : handler(_context, _nextFn);
    };
    return _nextFn();
  }

  public use(path: string, handler: RouterInterface | HandleFn): this;
  public use(handler: HandleFn | RouterInterface): this;
  public use(
    pathOrHandler: HandleFn | RouterInterface | string,
    handler?: HandleFn | RouterInterface,
  ): this {
    const _handler =
      typeof pathOrHandler === "string"
        ? this._handlePath(pathOrHandler, handler!)
        : pathOrHandler!;
    this._handlers.push(_handler);
    return this;
  }

  protected _defaultNext(): Promise<ResponseInterface> {
    throw new ServiceError(404, "route not found");
  }

  protected _handleError(): HandleFn {
    const normalize = (statusText: string): string =>
      statusText.replaceAll(/\s+/, "_").toLowerCase();
    return async (context, next) => {
      try {
        return await next();
      } catch (error) {
        const statusCode =
          error instanceof ServiceError ? error.statusCode : 500;
        const statusText = StatusText[statusCode];
        return context
          .respondWith(statusCode, statusText)
          .setHeader("Content-Type", "application/json")
          .setBody({
            error: normalize(statusText),
            reason: (error as Error).message,
          });
      }
    };
  }

  protected _handlePath(
    path: string,
    handler: HandleFn | RouterInterface,
  ): HandleFn {
    return async (context, next) => {
      const matchFn = match(path, this._options);
      const matches = matchFn(context.path);
      if (!matches) return next();
      Object.assign(context.params, matches.params);
      return "dispatch" in handler
        ? handler.dispatch(context, next)
        : handler(context, next);
    };
  }
}
