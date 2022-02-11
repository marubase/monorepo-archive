import { RequestContract } from "./request.contract.js";
import { ResponseContract } from "./response.contract.js";

export interface RouterContract {
  dispatch(request: RequestContract): Promise<ResponseContract>;

  use(handler: Handler): this;
}

export type Context = {
  readonly request: RequestContract;

  readonly response: ResponseContract;

  [property: string]: unknown;
};

export type Handler = (
  context: Context,
  next: NextFn,
) => Promise<ResponseContract>;

export type NextFn = () => Promise<ResponseContract>;
