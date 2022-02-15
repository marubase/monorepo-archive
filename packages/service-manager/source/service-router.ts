import {
  match,
  ParseOptions,
  RegexpToFunctionOptions,
  TokensToRegexpOptions,
} from "path-to-regexp";
import {
  ServiceContextContract,
  ServiceContextInterface,
} from "./contracts/service-context.contract.js";
import { ServiceManagerInterface } from "./contracts/service-manager.contract.js";
import {
  RequestMethod,
  ServiceRequestContract,
  ServiceRequestInterface,
} from "./contracts/service-request.contract.js";
import {
  ServiceResponseInterface,
  StatusText,
} from "./contracts/service-response.contract.js";
import {
  ConfigureFn,
  HandleFn,
  MatchMethod,
  MatchPath,
  NextFn,
  ServiceRouterInterface,
} from "./contracts/service-router.contract.js";
import { ServiceManagerError } from "./errors/service-manager.error.js";

export class ServiceRouter implements ServiceRouterInterface {
  protected _handlers: Array<HandleFn | ServiceRouterInterface> = [
    this._handleError(),
  ];

  protected _manager: ServiceManagerInterface;

  protected _options: ParseOptions &
    TokensToRegexpOptions &
    RegexpToFunctionOptions = {
    decode: decodeURIComponent,
    sensitive: true,
    strict: true,
  };

  public constructor(manager: ServiceManagerInterface) {
    this._manager = manager;
  }

  public configure(configureFn: ConfigureFn): this {
    configureFn(this);
    return this;
  }

  public dispatch(
    request: ServiceRequestInterface,
  ): Promise<ServiceResponseInterface>;
  public dispatch(
    context: ServiceContextInterface,
    next: NextFn,
  ): Promise<ServiceResponseInterface>;
  public dispatch(
    contextOrRequest: ServiceContextInterface | ServiceRequestInterface,
    next?: NextFn,
  ): Promise<ServiceResponseInterface> {
    const _context: ServiceContextInterface = !("replyWith" in contextOrRequest)
      ? this._manager.resolve(ServiceContextContract, contextOrRequest)
      : contextOrRequest;
    const _next = typeof next === "undefined" ? this._defaultNext : next;

    let _index = 0;
    const _lastIndex = this._handlers.length - 1;
    const _nextFn: NextFn = (): Promise<ServiceResponseInterface> => {
      if (_index > _lastIndex) return _next();
      const handler = this._handlers[_index++];
      return "dispatch" in handler
        ? handler.dispatch(_context, _nextFn)
        : handler(_context, _nextFn);
    };
    return _nextFn();
  }

  public handle(handler: HandleFn | ServiceRouterInterface): void {
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

  public request(method: RequestMethod, path: string): ServiceRequestInterface {
    return this._manager.resolve(ServiceRequestContract, this, method, path);
  }

  protected _defaultNext(): Promise<ServiceResponseInterface> {
    const context = `Dispatching service request.`;
    const problem = `Service request handler not found.`;
    const solution = `Please correct the service router and restart the process.`;
    throw new ServiceManagerError(404, `${context} ${problem} ${solution}`);
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
          .replyWith(statusCode, statusText)
          .setHeader("Content-Type", "application/json")
          .setData({
            error: normalize(statusText),
            reason: (error as Error).message,
          });
      }
    };
  }

  protected _handleMethod(
    method: RequestMethod[],
    handler: HandleFn | ServiceRouterInterface,
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
    handler: HandleFn | ServiceRouterInterface,
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
