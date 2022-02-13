import { match } from "path-to-regexp";
import { ContextInterface } from "./contracts/context.contract.js";
import {
  RequestInterface,
  RequestMethod,
} from "./contracts/request.contract.js";
import {
  ResponseInterface,
  StatusText,
} from "./contracts/response.contract.js";
import {
  HandleFn,
  MatchMethod,
  MatchPath,
  NextFn,
  RouterInterface,
  RouterOptions,
} from "./contracts/router.contract.js";
import {
  ServiceManagerFactory,
  ServiceManagerInterface,
} from "./contracts/service-manager.contract.js";
import { ServiceManagerError } from "./errors/service-manager.error.js";

export class Router implements RouterInterface {
  protected _factory: ServiceManagerFactory;

  protected _handlers: Array<HandleFn | RouterInterface> = [
    this._handleError(),
  ];

  protected _manager: ServiceManagerInterface;

  protected _options: RouterOptions = {
    decode: decodeURIComponent,
    sensitive: true,
    strict: true,
  };

  public constructor(
    factory: ServiceManagerFactory,
    manager: ServiceManagerInterface,
  ) {
    this._factory = factory;
    this._manager = manager;
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
      ? this._factory.createContext(
          this._factory,
          this._manager,
          contextOrRequest,
        )
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

  public handle(handler: HandleFn | RouterInterface): void {
    this._handlers.push(handler);
  }

  public method(method: RequestMethod[] | RequestMethod): MatchMethod {
    const _method = !Array.isArray(method) ? [method] : method;
    return {
      handle: (handler) => {
        const _handler = this._handleMethod(_method, handler);
        this._handlers.push(_handler);
      },
      path: (path: string) => ({
        handle: (handler) => {
          const _pathHandler = this._handlePath(path, handler);
          const _handler = this._handleMethod(_method, _pathHandler);
          this._handlers.push(_handler);
        },
      }),
    };
  }

  public path(path: string): MatchPath {
    return {
      handle: (handler) => {
        const _handler = this._handlePath(path, handler);
        this._handlers.push(_handler);
      },
    };
  }

  protected _defaultNext(): Promise<ResponseInterface> {
    throw new ServiceManagerError(404, "route not found");
  }

  protected _handleError(): HandleFn {
    const normalize = (statusText: string): string =>
      statusText.replaceAll(/\s+/g, "_").toLowerCase();
    return async (context, next) => {
      try {
        return await next();
      } catch (error) {
        const statusCode =
          error instanceof ServiceManagerError ? error.statusCode : 500;
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

  protected _handleMethod(
    method: RequestMethod[],
    handler: HandleFn | RouterInterface,
  ): HandleFn {
    return async (context, next) => {
      if (method.indexOf(context.method) < 0) return next();
      return "dispatch" in handler
        ? handler.dispatch(context, next)
        : handler(context, next);
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
