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
  dispatch(request: RequestInterface): Promise<ResponseInterface>;
  dispatch(context: ContextInterface, next: NextFn): Promise<ResponseInterface>;

  use(path: string, handler: HandleFn | RouterInterface): this;
  use(handler: HandleFn | RouterInterface): this;
}

export type HandleFn = (
  context: ContextInterface,
  next: NextFn,
) => Promise<ResponseInterface>;

export type NextFn = () => Promise<ResponseInterface>;

export type RouterMethod = Record<
  Lowercase<RequestMethod>,
  (path: string, handler: HandleFn | RouterInterface) => RouterInterface
>;

export type RouterOptions = ParseOptions &
  RegexpToFunctionOptions &
  TokensToRegexpOptions;
