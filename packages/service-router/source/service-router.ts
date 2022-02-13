import {
  ContainerContract,
  ContainerInterface,
  inject,
  resolvable,
} from "@marubase/container";
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
import {
  ServiceRequestContract,
  ServiceRequestInterface,
  ServiceRequestMethod,
} from "./contracts/service-request.contract.js";
import {
  ServiceResponseInterface,
  StatusText,
} from "./contracts/service-response.contract.js";
import {
  HandleFn,
  MatchMethod,
  MatchPath,
  NextFn,
  ServiceRouterInterface,
} from "./contracts/service-router.contract.js";
import { ServiceRouterError } from "./errors/service-router.error.js";

@resolvable()
export class ServiceRouter implements ServiceRouterInterface {
  protected _container: ContainerInterface;

  protected _handlers: Array<HandleFn | ServiceRouterInterface> = [
    this._handleError(),
  ];

  protected _options: ParseOptions &
    TokensToRegexpOptions &
    RegexpToFunctionOptions = {
    decode: decodeURIComponent,
    sensitive: true,
    strict: true,
  };

  public constructor(@inject(ContainerContract) container: ContainerInterface) {
    this._container = container;
  }

  public get container(): ContainerInterface {
    return this._container;
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
    const _context = !("respondWith" in contextOrRequest)
      ? this._container.resolve<ServiceContextInterface>(ServiceContextContract)
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

  public method(
    method: ServiceRequestMethod[] | ServiceRequestMethod,
  ): MatchMethod {
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

  public request(
    method: ServiceRequestMethod,
    path: string,
  ): ServiceRequestInterface {
    return this._container
      .resolve<ServiceRequestInterface>(ServiceRequestContract)
      .setDispatcher(this)
      .setMethod(method)
      .setPath(path);
  }

  protected _defaultNext(): Promise<ServiceResponseInterface> {
    const context = `Dispatching service request.`;
    const problem = `Service request handler not found.`;
    const solution = `Please correct the service router and restart the process.`;
    throw new ServiceRouterError(404, `${context} ${problem} ${solution}`);
  }

  protected _handleError(): HandleFn {
    const normalize = (statusText: string): string =>
      statusText.replaceAll(/\s+/g, "_").toLowerCase();
    return async (context, next) => {
      try {
        return await next();
      } catch (error) {
        const statusCode =
          error instanceof ServiceRouterError ? error.statusCode : 500;
        const statusText = StatusText[statusCode];
        return context
          .replyWith(statusCode, statusText)
          .setHeader("Content-Type", "application/json")
          .setBody({
            error: normalize(statusText),
            reason: (error as Error).message,
          });
      }
    };
  }

  protected _handleMethod(
    method: ServiceRequestMethod[],
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
