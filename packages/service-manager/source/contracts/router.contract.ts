import {
  ParseOptions,
  RegexpToFunctionOptions,
  TokensToRegexpOptions,
} from "path-to-regexp";
import { ContextInterface } from "./context.contract.js";
import { RequestInterface, RequestMethod } from "./request.contract.js";
import { ResponseInterface } from "./response.contract.js";

export const RouterContract = Symbol("RouterContract");

export interface RouterInterface {
  configure(configureFn: ConfigureFn): this;

  dispatch(request: RequestInterface): Promise<ResponseInterface>;
  dispatch(context: ContextInterface, next: NextFn): Promise<ResponseInterface>;

  handle(handler: HandleFn | RouterInterface): void;

  method(method: RequestMethod[] | RequestMethod): MatchMethod;

  origin(origin: string): MatchOrigin;

  path(path: string): MatchPath;
}

export type ConfigureFn = (router: RouterInterface) => void;

export type HandleFn = (
  context: ContextInterface,
  next: NextFn,
) => Promise<ResponseInterface>;

export type MatchMethod = {
  handle(handler: HandleFn): void;

  path(path: string): MatchPath;
};

export type MatchOrigin = {
  handle(handler: HandleFn | RouterInterface): void;

  method(method: RequestMethod[] | RequestMethod): MatchMethod;

  path(path: string): MatchPath;
};

export type MatchPath = {
  handle(handler: HandleFn | RouterInterface): void;
};

export type NextFn = () => Promise<ResponseInterface>;

export type RouterMethod = Record<
  Lowercase<RequestMethod>,
  (path: string, handler: HandleFn | RouterInterface) => RouterInterface
>;

export type RouterOptions = ParseOptions &
  RegexpToFunctionOptions &
  TokensToRegexpOptions;
