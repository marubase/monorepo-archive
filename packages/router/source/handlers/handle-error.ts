import { ResponseCode } from "../contracts/response.contract.js";
import { HandleFn } from "../contracts/router.contract.js";
import { RouterError } from "../errors/router.error.js";

function normalizeError(text: string): string {
  return text.toLowerCase().replaceAll(/\s/, "_");
}

export function handleError(): HandleFn {
  return async (context, next) => {
    try {
      return await next();
    } catch (error) {
      const statusCode = error instanceof RouterError ? error.status : 500;
      const statusText = ResponseCode[statusCode];
      return context.response
        .clearHeaders()
        .clearBody()
        .setStatus(statusCode)
        .setHeader("content-type", "application/json")
        .setBody({
          error: normalizeError(statusText),
          readon: (error as Error).message,
        });
    }
  };
}
