import { expect } from "chai";
import { instance, mock, reset } from "ts-mockito";
import { BindingAlias, BindingRoot } from "./contracts/registry.contract.js";
import { ScopeInterface } from "./contracts/scope.contract.js";
import { setResolvable } from "./metadata.js";
import { Registry } from "./registry.js";
import { BaseResolver } from "./resolvers/base-resolver.js";

describe("Registry", function () {
  let mockScope: ScopeInterface;
  let registry: Registry;
  let scope: ScopeInterface;
  beforeEach(async function () {
    mockScope = mock();
    registry = new Registry();
    scope = instance(mockScope);
  });
  afterEach(async function () {
    reset(mockScope);
  });

  describe("#call(scope, callable, ...args)", function () {
    context("when callable is resolvable", function () {
      it("should return result", async function () {
        const date = new Date();
        setResolvable(date, "toISOString");
        const result = registry.call(scope, [date, "toISOString"]);
        expect(result).to.be.a("string");
      });
    });
    context("when callable is not resolvable", function () {
      it("should return result", async function () {
        const date = new Date();
        const result = registry.call(scope, [date, "toISOString"]);
        expect(result).to.be.a("string");
      });
    });
  });

  describe("#clearResolverByKey(bindingKey)", function () {
    context("when there is single resolver", function () {
      it("should return self", async function () {
        registry.createConstantResolver(true).setBindingKey(["test", "row"]);

        const self = registry.clearResolverByKey(["test", "row"]);
        expect(self).to.equal(registry);
      });
    });
    context("when there is multiple resolver", function () {
      it("should return self", async function () {
        registry.createConstantResolver(true).setBindingKey(["test", "row0"]);
        registry.createConstantResolver(true).setBindingKey(["test", "row1"]);

        const self = registry.clearResolverByKey(["test", "row0"]);
        expect(self).to.equal(registry);
      });
    });
    context("when there is no resolver", function () {
      it("should return self", async function () {
        const self = registry.clearResolverByKey(["test", "row"]);
        expect(self).to.equal(registry);
      });
    });
  });

  describe("#clearResolverByTag(bindingTag, resolver)", function () {
    context("when there is single resolver", function () {
      it("should return self", async function () {
        const resolver = registry
          .createConstantResolver(true)
          .setBindingTag("tag");

        const self = registry.clearResolverByTag("tag", resolver);
        expect(self).to.equal(registry);
      });
    });
    context("when there is no resolver", function () {
      it("should return self", async function () {
        const resolver = registry.createConstantResolver(true);

        const self = registry.clearResolverByTag("tag", resolver);
        expect(self).to.equal(registry);
      });
    });
  });

  describe("#createAliasResolver(alias)", function () {
    it("should return resolver", async function () {
      const resolver = registry.createAliasResolver("alias");
      expect(resolver).to.be.an.instanceOf(BaseResolver);
    });
  });

  describe("#createClassResolver(target)", function () {
    it("should return resolver", async function () {
      const resolver = registry.createClassResolver(Date);
      expect(resolver).to.be.an.instanceOf(BaseResolver);
    });
  });

  describe("#createConstantResolver(constant)", function () {
    it("should return resolver", async function () {
      const resolver = registry.createConstantResolver(true);
      expect(resolver).to.be.an.instanceOf(BaseResolver);
    });
  });

  describe("#createFunctionResolver(target)", function () {
    it("should return resolver", async function () {
      const resolver = registry.createFunctionResolver(() => true);
      expect(resolver).to.be.an.instanceOf(BaseResolver);
    });
  });

  describe("#createKeyResolver(key)", function () {
    it("should return resolver", async function () {
      const resolver = registry.createKeyResolver(["test", "method"]);
      expect(resolver).to.be.an.instanceOf(BaseResolver);
    });
  });

  describe("#createMethodResolver(target, method)", function () {
    it("should return resolver", async function () {
      const resolver = registry.createMethodResolver("test", "method");
      expect(resolver).to.be.an.instanceOf(BaseResolver);
    });
  });

  describe("#createTagResolver(tag)", function () {
    it("should return resolver", async function () {
      const resolver = registry.createTagResolver("tag");
      expect(resolver).to.be.an.instanceOf(BaseResolver);
    });
  });

  describe("#fetch(resolvable)", function () {
    context("when there is resolvable", function () {
      it("should return resolver", async function () {
        registry
          .createConstantResolver(true)
          .setBindingKey(["test", BindingRoot]);

        const resolver = registry.fetch(["test", BindingRoot]);
        expect(resolver).to.be.an.instanceOf(BaseResolver);
      });
    });
    context("when there is resolvable 'test'", function () {
      it("should return resolver", async function () {
        registry
          .createConstantResolver(true)
          .setBindingKey(["test", BindingRoot]);

        const resolver = registry.fetch("test");
        expect(resolver).to.be.an.instanceOf(BaseResolver);
      });
    });
    context("when there is resolvable 'test#method'", function () {
      it("should return resolver", async function () {
        registry.createConstantResolver(true).setBindingKey(["test", "method"]);

        const resolver = registry.fetch("test#method");
        expect(resolver).to.be.an.instanceOf(BaseResolver);
      });
    });
    context("when there is resolvable alias", function () {
      it("should return resolver", async function () {
        registry
          .createConstantResolver(true)
          .setBindingKey(["test", BindingAlias]);

        const resolver = registry.fetch("test#method");
        expect(resolver).to.be.an.instanceOf(BaseResolver);
      });
    });
  });

  describe("#fork()", function () {
    context("when there is bindingKey", function () {
      it("should return fork", async function () {
        registry.createConstantResolver(true).setBindingKey(["test", "method"]);

        const fork = registry.fork();
        expect(fork).to.be.an.instanceOf(Registry);
      });
    });
    context("when there is bindingTag", function () {
      it("should return fork", async function () {
        registry.createConstantResolver(true).setBindingTag("test");

        const fork = registry.fork();
        expect(fork).to.be.an.instanceOf(Registry);
      });
    });
    context("when there is no binding", function () {
      it("should return fork", async function () {
        const fork = registry.fork();
        expect(fork).to.be.an.instanceOf(Registry);
      });
    });
  });

  describe("#getResolverByKey(bindingKey)", function () {
    context("when there is bindingKey", function () {
      it("should return resolver", async function () {
        registry.createConstantResolver(true).setBindingKey(["test", "method"]);

        const resolver = registry.getResolverByKey(["test", "method"]);
        expect(resolver).to.be.an.instanceOf(BaseResolver);
      });
    });
    context("when there is no bindingKey", function () {
      it("should return undefined", async function () {
        const resolver = registry.getResolverByKey(["test", "method"]);
        expect(resolver).to.be.undefined;
      });
    });
  });

  describe("#getResolverByTag(bindingTag)", function () {
    context("when there is bindingTag", function () {
      it("should return resolvers", async function () {
        const resolver = registry
          .createConstantResolver(true)
          .setBindingTag("test");

        const resolvers = registry.getResolverByTag("test");
        expect(resolvers).to.deep.equal([resolver]);
      });
    });
    context("when there is no bindingTag", function () {
      it("should return resolvers", async function () {
        const resolvers = registry.getResolverByTag("test");
        expect(resolvers).to.deep.equal([]);
      });
    });
  });

  describe("#resolve(scope, resolvable)", function () {
    context("when the resolvable is ['test', BindingRoot]", function () {
      it("should resolve result", async function () {
        registry
          .createConstantResolver(true)
          .setBindingKey(["test", BindingRoot]);

        const instance = registry.resolve(scope, ["test", BindingRoot]);
        expect(instance).to.be.true;
      });
    });
    context("when the resolvable is 'test'", function () {
      it("should resolve result", async function () {
        registry
          .createConstantResolver(true)
          .setBindingKey(["test", BindingRoot]);

        const instance = registry.resolve(scope, "test");
        expect(instance).to.be.true;
      });
    });
    context("when the resolvable is 'test#method'", function () {
      it("should resolve result", async function () {
        registry.createConstantResolver(true).setBindingKey(["test", "method"]);

        const instance = registry.resolve(scope, "test#method");
        expect(instance).to.be.true;
      });
    });
  });

  describe("#unbind(bindable)", function () {
    context("when there is resolver", function () {
      it("should return map", async function () {
        const resolver = registry.bind("test").toConstant(true);

        const resolvers = registry.unbind("test");
        expect(Array.from(resolvers)).to.deep.equal([[BindingRoot, resolver]]);
      });
    });
    context("when there is no resolver", function () {
      it("should return empty map", async function () {
        const resolvers = registry.unbind("test");
        expect(Array.from(resolvers)).to.deep.equal([]);
      });
    });
  });
});
