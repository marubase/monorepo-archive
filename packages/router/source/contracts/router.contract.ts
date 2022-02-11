import { ContextInterface } from "./context.contract.js";
import { RequestInterface } from "./request.contract.js";
import { ResponseInterface } from "./response.contract.js";

export const RouterContract = Symbol("RouterContract");

export interface RouterInterface {
  createRequest(): RequestInterface;

  dispatch(request: RequestInterface): Promise<ResponseInterface>;

  use(handler: HandleFn): this;
}

export type HandleFn = (
  context: ContextInterface,
  next: NextFn,
) => Promise<ResponseInterface>;

export type NextFn = () => Promise<ResponseInterface>;

export type RouterFactory = {
  createContext(
    request: RequestInterface,
    response: ResponseInterface,
  ): ContextInterface;

  createRequest(): RequestInterface;

  createResponse(): ResponseInterface;
};
