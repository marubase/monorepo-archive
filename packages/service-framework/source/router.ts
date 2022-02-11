import {
  Container,
  ContainerContract,
  inject,
  resolvable,
} from "@marubase/container";
import { RequestContract } from "./contracts/request.contract.js";
import { ResponseContract } from "./contracts/response.contract.js";
import {
  Handler,
  NextFn,
  RouterContract,
} from "./contracts/router.contract.js";
import { handleError } from "./handlers/handle-error.js";
import { Response } from "./response.js";

@resolvable()
export class Router implements RouterContract {
  protected _container: ContainerContract;

  protected _handlers: Handler[] = [handleError()];

  public constructor(@inject(Container) container: ContainerContract) {
    this._container = container;
  }

  public async dispatch(request: RequestContract): Promise<ResponseContract> {
    const response = this._container.resolve<ResponseContract>(Response);

    let index = 0;
    const next: NextFn = () =>
      index <= this._handlers.length - 1
        ? this._handlers[index++]({ request, response }, next)
        : Promise.resolve(response.setStatus(404).setBody({ ok: true }));
    return next();
  }

  public use(handler: Handler): this {
    this._handlers.push(handler);
    return this;
  }
}
