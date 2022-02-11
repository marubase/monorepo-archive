import { expect } from "chai";
import { Container } from "./container.js";
import { ProviderInterface } from "./contracts/provider.contract.js";
import { inject, resolvable, tag } from "./decorator.js";
import { ContainerError } from "./errors/container.error.js";
import { Registry } from "./registry.js";
import { BaseResolver } from "./resolvers/base-resolver.js";
import { Scope } from "./scope.js";

@resolvable()
@tag("class")
class Tester {
  protected _date: Date;

  public constructor(@inject(Date) date: Date) {
    this._date = date;
  }

  @resolvable()
  @tag("method")
  public test(@inject("random") random: number): string {
    return `${this._date.toISOString()}#${random}`;
  }
}

class TestProvider implements ProviderInterface {
  public async boot(): Promise<void> {
    return;
  }
  public install(): void {
    return;
  }
  public async shutdown(): Promise<void> {
    return;
  }
  public uninstall(): void {
    return;
  }
}

class ShutdowProvider implements ProviderInterface {
  public async boot(): Promise<void> {
    return;
  }
  public async shutdown(): Promise<void> {
    return;
  }
}

class EmptyProvider implements ProviderInterface {}

describe("Container", function () {
  let container: Container;
  beforeEach(async function () {
    container = new Container();
  });

  describe("#booted", function () {
    it("should return booted", async function () {
      expect(container.booted).to.be.false;
    });
  });

  describe("#providers", function () {
    it("should return providers", async function () {
      expect(container.providers).to.deep.equal({});
    });
  });

  describe("#registry", function () {
    it("should return registry", async function () {
      expect(container.registry).to.be.an.instanceOf(Registry);
    });
  });

  describe("#scope", function () {
    it("should return scope", async function () {
      expect(container.scope).to.be.an.instanceOf(Scope);
    });
  });

  describe("#bind(bindable)", function () {
    it("should return registry binding", async function () {
      const binding = container.bind("test");
      expect(binding).to.have.property("to");
      expect(binding).to.have.property("toAlias");
      expect(binding).to.have.property("toClass");
      expect(binding).to.have.property("toConstant");
      expect(binding).to.have.property("toFunction");
      expect(binding).to.have.property("toKey");
      expect(binding).to.have.property("toMethod");
      expect(binding).to.have.property("toSelf");
      expect(binding).to.have.property("toTag");
    });
  });

  describe("#boot()", function () {
    context("when it is not booted", function () {
      it("should run", async function () {
        container.install("test", new TestProvider());
        container.install("empty", new EmptyProvider());
        await container.boot();
      });
    });
    context("when it is booted", function () {
      it("should run", async function () {
        container.install("test", new TestProvider());
        container.install("empty", new EmptyProvider());
        await container.boot();
        await container.boot();
      });
    });
  });

  describe("#call(callable, ...args)", function () {
    it("should return result", async function () {
      container.bind(Date).toSelf();
      container.bind(Tester).toSelf();
      container.bind("random").toFunction(() => Math.random());

      const tester = container.resolve<Tester>(Tester);
      const result = container.call<string>([tester, "test"]);
      expect(result).to.be.a("string");
    });
  });

  describe("#fetch(resolvable)", function () {
    it("should return resolver", async function () {
      container.bind(Date).toSelf();

      const resolver = container.fetch(Date);
      expect(resolver).to.be.an.instanceOf(BaseResolver);
    });
  });

  describe("#fork()", function () {
    it("should return fork", async function () {
      const fork = container.fork();
      expect(fork).to.be.an.instanceOf(Container);
    });
  });

  describe("#install(name, provider)", function () {
    context("when installing test provider", function () {
      it("should return self", async function () {
        const self = container.install("test", new TestProvider());
        expect(self).to.equal(container);
      });
    });
    context("when installing empty provider", function () {
      it("should return self", async function () {
        const self = container.install("empty", new EmptyProvider());
        expect(self).to.equal(container);
      });
    });
    context("when it is booted", function () {
      it("should return self", async function () {
        await container.boot();
        const self = container.install("test", new TestProvider());
        expect(self).to.equal(container);
      });
    });
    context("when it is already installed", function () {
      it("should return self", async function () {
        container.install("test", new TestProvider());

        const process = (): unknown =>
          container.install("test", new TestProvider());
        expect(process).to.throw(ContainerError);
      });
    });
    context("when it is already installed (symbol)", function () {
      it("should return self", async function () {
        const bindable = Symbol("test");
        container.install(bindable, new TestProvider());

        const process = (): unknown =>
          container.install(bindable, new TestProvider());
        expect(process).to.throw(ContainerError);
      });
    });
  });

  describe("#installed(name)", function () {
    it("should return false", async function () {
      const installed = container.installed("test");
      expect(installed).to.be.false;
    });
  });

  describe("#resolve(resolvable, ...args)", function () {
    it("should return instance", async function () {
      container.bind(Date).toSelf();

      const instance = container.resolve(Date);
      expect(instance).to.be.an.instanceOf(Date);
    });
  });

  describe("#shutdown()", function () {
    context("when it is booted", function () {
      it("should run", async function () {
        container.install("test", new TestProvider());
        container.install("empty", new EmptyProvider());
        await container.boot();
        await container.shutdown();
      });
    });
    context("when it is not booted", function () {
      it("should run", async function () {
        container.install("test", new TestProvider());
        container.install("empty", new EmptyProvider());
        await container.shutdown();
      });
    });
  });

  describe("#unbind(bindable)", function () {
    it("should return self", async function () {
      container.bind(Date).toSelf().setScope("singleton");
      container.resolve(Date);

      const self = container.unbind(Date);
      expect(self).to.equal(container);
    });
  });

  describe("#uninstall(name)", function () {
    context("when uninstalling existing provider", function () {
      it("should return self", async function () {
        container.install("test", new TestProvider());

        const self = container.uninstall("test");
        expect(self).to.equal(container);
      });
    });
    context(
      "when uninstalling existing provider with no uninstall",
      function () {
        it("should return self", async function () {
          container.install("empty", new EmptyProvider());

          const self = container.uninstall("empty");
          expect(self).to.equal(container);
        });
      },
    );
    context("when container already booted", function () {
      it("should return self", async function () {
        container.install("test", new TestProvider());
        await container.boot();

        const self = container.uninstall("test");
        expect(self).to.equal(container);
      });
    });
    context("when container already booted and have no uninstall", function () {
      it("should return self", async function () {
        container.install("shutdown", new ShutdowProvider());
        await container.boot();

        const self = container.uninstall("shutdown");
        expect(self).to.equal(container);
      });
    });
    context("when uninstalling missing provider", function () {
      it("should return self", async function () {
        const process = (): unknown => container.uninstall("test");
        expect(process).to.throw(ContainerError);
      });
    });
    context("when uninstalling missing provider (symbol)", function () {
      it("should return self", async function () {
        const process = (): unknown => container.uninstall(Symbol("test"));
        expect(process).to.throw(ContainerError);
      });
    });
  });
});
