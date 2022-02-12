import { ContextInterface } from "./context.contract.js";
import { RequestInterface } from "./request.contract.js";
import { ResponseInterface } from "./response.contract.js";

export const RouterContract = Symbol("RouterContract");

export interface RouterInterface {
  dispatch(request: RequestInterface): Promise<ResponseInterface>;
  dispatch(context: ContextInterface, next: NextFn): Promise<ResponseInterface>;

  use(handler: HandleFn | RouterInterface): this;
  use(path: string, handler: HandleFn | RouterInterface): this;
}

export type HandleFn = (
  context: ContextInterface,
  next: NextFn,
) => Promise<ResponseInterface>;

export type NextFn = () => Promise<ResponseInterface>;
