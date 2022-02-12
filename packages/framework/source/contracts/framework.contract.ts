import { ContextInterface } from "./context.contract.js";
import { RequestInterface } from "./request.contract.js";
import { ResponseInterface, StatusCode } from "./response.contract.js";

export const FrameworkContract = Symbol("FrameworkContract");

export type FrameworkFactory = {
  createContext(
    request: RequestInterface,
    factory: FrameworkFactory,
  ): ContextInterface;

  createRequest(): RequestInterface;

  createResponse(
    statusCode: StatusCode,
    statusText?: string,
  ): ResponseInterface;
};
