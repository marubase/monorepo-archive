import { match } from "path-to-regexp";
import { ContextInterface } from "./contracts/context.contract.js";
import { ManagerFactory } from "./contracts/manager.contract.js";
import {
  RequestInterface,
  RequestMethod,
} from "./contracts/request.contract.js";
import {
  ResponseInterface,
  StatusText,
} from "./contracts/response.contract.js";
import {
  ConfigureFn,
  HandleFn,
  MatchMethod,
  MatchOrigin,
  MatchPath,
  NextFn,
  RouterInterface,
  RouterOptions,
} from "./contracts/router.contract.js";
import { ServiceError } from "./errors/service.error.js";

export class Router implements RouterInterface {
  protected _factory: ManagerFactory;

  protected _handlers: Array<HandleFn | RouterInterface> = [
    this._handleError(),
  ];

  protected _options: RouterOptions = {
    decode: decodeURIComponent,
    sensitive: true,
    strict: true,
  };

  public constructor(factory: ManagerFactory) {
    this._factory = factory;
  }

  public configure(configureFn: ConfigureFn): this {
    configureFn(this);
    return this;
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

  public origin(origin: string): MatchOrigin {
    return {
      handle: (handler) => {
        const _handler = this._handleOrigin(origin, handler);
        this._handlers.push(_handler);
      },
      method: (method) => ({
        handle: (handler) => {
          const _method = !Array.isArray(method) ? [method] : method;
          const _methodHandler = this._handleMethod(_method, handler);
          const _handler = this._handleOrigin(origin, _methodHandler);
          this._handlers.push(_handler);
        },
        path: (path) => ({
          handle: (handler) => {
            const _method = !Array.isArray(method) ? [method] : method;
            const _pathHandler = this._handlePath(path, handler);
            const _methodHandler = this._handleMethod(_method, _pathHandler);
            const _handler = this._handleOrigin(origin, _methodHandler);
            this._handlers.push(_handler);
          },
        }),
      }),
      path: (path) => ({
        handle: (handler) => {
          const _pathHandler = this._handlePath(path, handler);
          const _handler = this._handleOrigin(origin, _pathHandler);
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
    throw new ServiceError(404, "route not found");
  }

  protected _handleError(): HandleFn {
    const normalize = (statusText: string): string =>
      statusText.replaceAll(/\s+/g, "_").toLowerCase();
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

  protected _handleOrigin(
    origin: string,
    handler: HandleFn | RouterInterface,
  ): HandleFn {
    return async (context, next) => {
      if (context.origin !== origin) return next();
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
