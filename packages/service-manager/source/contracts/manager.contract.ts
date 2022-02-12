import { ContextInterface } from "./context.contract.js";
import { RequestInterface } from "./request.contract.js";
import { ResponseInterface, StatusCode } from "./response.contract.js";
import { RouterInterface, RouterOptions } from "./router.contract.js";

export const ManagerContract = Symbol("ManagerContract");

export type ManagerFactory = {
  createContext: (
    request: RequestInterface,
    factory: ManagerFactory,
  ) => ContextInterface;

  createRequest: () => RequestInterface;

  createResponse: (
    statusCode: StatusCode,
    statusText?: string,
  ) => ResponseInterface;

  createRouter: (
    factory: ManagerFactory,
    options: RouterOptions,
  ) => RouterInterface;
};
