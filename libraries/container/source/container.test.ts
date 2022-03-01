import { expect } from "chai";
import { Container } from "./container.js";
import {
  ContainerContract,
  ResolveFactory,
} from "./contracts/container.contract.js";
import { ContainerError } from "./errors/container.error.js";

describe("Container", function () {
  let container: Container;
  beforeEach(async function () {
    container = new Container();
  });

  describe("get booted()", function () {
    it("should return false", async function () {
      const booted = container.booted;
      expect(booted).to.be.false;
    });
  });

  describe("get cache", function () {
    it("should return cache", async function () {
      const cache = container.cache;
      expect(cache).to.have.property("container");
      expect(cache).to.have.property("request");
      expect(cache).to.have.property("singleton");
    });
  });

  describe("get providers", function () {
    it("should return provider map", async function () {
      const providers = container.providers;
      expect(providers).to.be.an.instanceOf(Map);
    });
  });

  describe("get resolvers", function () {
    it("should return resolver map", async function () {
      const resolver = container.resolver;
      expect(resolver).to.be.an.instanceOf(Map);
    });
  });

  describe("get scope", function () {
    it("should return scope", async function () {
      const scope = container.scope;
      expect(scope).to.equal("container");
    });
  });

  describe("#bind(key, factory)", function () {
    it("should return self", async function () {
      const factoryFn: ResolveFactory = () => true;

      const self = container.bind("test", factoryFn);
      expect(self).to.equal(container);

      const instance = container.resolve<true>("test");
      expect(instance).to.be.true;
    });
  });

  describe("#bind(key, factory, options)", function () {
    it("should return self", async function () {
      const factoryFn: ResolveFactory = () => true;

      const self = container.bind("test", factoryFn, { scope: "container" });
      expect(self).to.equal(container);

      const instance = container.resolve<true>("test");
      expect(instance).to.be.true;

      const cached = container.resolve<true>("test");
      expect(cached).to.be.true;
    });
  });

  describe("#boot()", function () {
    context("when container is booted", function () {
      it("should run", async function () {
        container.install("provider-0", {});
        container.install("provider-1", { boot: () => Promise.resolve() });
        await container.boot();

        await container.boot();
        expect(container.booted).to.be.true;
      });
    });
    context("when container is not booted", function () {
      it("should run", async function () {
        container.install("provider-0", {});
        container.install("provider-1", { boot: () => Promise.resolve() });

        await container.boot();
        expect(container.booted).to.be.true;
      });
    });
  });

  describe("#bound(key)", function () {
    it("should return bound", async function () {
      const bound = container.bound("test");
      expect(bound).to.be.false;
    });
  });

  describe("#fork()", function () {
    it("should return fork", async function () {
      const fork = container.fork();
      expect(fork).to.be.an.instanceOf(Container);
    });
  });

  describe("#fork(scope)", function () {
    context("when scope is 'container'", function () {
      it("should return fork", async function () {
        const fork = container.fork("container");
        expect(fork).to.be.an.instanceOf(Container);
      });
    });
    context("when scope is 'request'", function () {
      it("should return fork", async function () {
        const fork = container.fork("request");
        expect(fork).to.be.an.instanceOf(Container);
      });
    });
  });

  describe("#install(key, provider)", function () {
    context("when container have no provider", function () {
      it("should return self", async function () {
        const self = container.install("provider", { install: () => null });
        expect(self).to.equal(container);
      });
    });
    context("when provider have no install method", function () {
      it("should return self", async function () {
        const self = container.install("provider", {});
        expect(self).to.equal(container);
      });
    });
    context("when container is booted", function () {
      it("should return self", async function () {
        await container.boot();

        const self = container.install("provider", {
          boot: () => Promise.resolve(),
          install: () => null,
        });
        expect(self).to.equal(container);
      });
    });
    context("when container have provider", function () {
      context("and key is symbol", function () {
        it("should throw error", async function () {
          const symbol = Symbol("provider");
          container.install(symbol, { install: () => null });

          const process = (): unknown => container.install(symbol, {});
          expect(process).to.throw(ContainerError);
        });
      });
      context("and key is string", function () {
        it("should throw error", async function () {
          container.install("provider", { install: () => null });

          const process = (): unknown => container.install("provider", {});
          expect(process).to.throw(ContainerError);
        });
      });
    });
  });

  describe("#installed(key)", function () {
    it("should return installed", async function () {
      const installed = container.installed("provider");
      expect(installed).to.be.false;
    });
  });

  describe("#resolve(key)", function () {
    context("when there is resolve factory", function () {
      it("should resolve factory", async function () {
        const factoryFn: ResolveFactory = (container) =>
          container.resolve(ContainerContract);
        container.bind("test", factoryFn);

        const resolved = container.resolve<Container>("test");
        expect(resolved).to.be.an.instanceOf(Container);
      });
    });
    context("when there is no resolve factory", function () {
      context("and key is function", function () {
        it("should throw error", async function () {
          const process = (): unknown => container.resolve(Date);
          expect(process).to.throw(ContainerError);
        });
      });
      context("and key is symbol", function () {
        it("should throw error", async function () {
          const process = (): unknown => container.resolve(Symbol("Date"));
          expect(process).to.throw(ContainerError);
        });
      });
      context("and key is string", function () {
        it("should throw error", async function () {
          const process = (): unknown => container.resolve("Date");
          expect(process).to.throw(ContainerError);
        });
      });
    });
  });

  describe("#shutdown()", function () {
    context("when container is booted", function () {
      it("should run", async function () {
        container.install("provider-0", {});
        container.install("provider-1", { shutdown: () => Promise.resolve() });
        await container.boot();

        await container.shutdown();
        expect(container.booted).to.be.false;
      });
    });
    context("when container is not booted", function () {
      it("should run", async function () {
        container.install("provider-0", {});
        container.install("provider-1", { shutdown: () => Promise.resolve() });

        await container.shutdown();
        expect(container.booted).to.be.false;
      });
    });
  });

  describe("#unbind(key)", function () {
    it("should return self", async function () {
      const self = container.unbind("test");
      expect(self).to.equal(container);
    });
  });

  describe("#uninstall(key)", function () {
    context("when container is booted", function () {
      context("and provider have shutdown ", function () {
        it("should return self", async function () {
          container.install("provider", {
            shutdown: () => Promise.resolve(),
          });
          await container.boot();

          const self = container.uninstall("provider");
          expect(self).to.equal(container);
        });
      });
      context("and provider have shutdown and uninstall method", function () {
        it("should return self", async function () {
          container.install("provider", {
            shutdown: () => Promise.resolve(),
            uninstall: () => null,
          });
          await container.boot();

          const self = container.uninstall("provider");
          expect(self).to.equal(container);
        });
      });
    });
    context("when container is not booted", function () {
      context("and provider have uninstall method", function () {
        it("should return self", async function () {
          container.install("provider", {
            uninstall: () => null,
          });

          const self = container.uninstall("provider");
          expect(self).to.equal(container);
        });
      });
      context("and provider have no uninstall method", function () {
        it("should return self", async function () {
          container.install("provider", {});

          const self = container.uninstall("provider");
          expect(self).to.equal(container);
        });
      });
    });
    context("when container have no provider", function () {
      context("and key is symbol", function () {
        it("should throw error", async function () {
          const process = (): unknown =>
            container.uninstall(Symbol("provider"));
          expect(process).to.throw(ContainerError);
        });
      });
      context("and key is string", function () {
        it("should throw error", async function () {
          const process = (): unknown => container.uninstall("provider");
          expect(process).to.throw(ContainerError);
        });
      });
    });
  });
});
