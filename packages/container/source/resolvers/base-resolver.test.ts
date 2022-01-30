import { expect } from "chai";
import { instance, mock, reset, when } from "ts-mockito";
import { RegistryContract } from "../contracts/registry.contract.js";
import { ScopeContract } from "../contracts/scope.contract.js";
import { ContainerError } from "../errors/container.error.js";
import { BaseResolver } from "./base-resolver.js";

describe("BaseResolver", function () {
  let mockRegistry: RegistryContract;
  let mockScope: ScopeContract;
  let registry: RegistryContract;
  let resolver: BaseResolver;
  let scope: ScopeContract;
  beforeEach(async function () {
    mockRegistry = mock();
    mockScope = mock();
    registry = instance(mockRegistry);
    scope = instance(mockScope);
    resolver = new BaseResolver(registry);
  });
  afterEach(async function () {
    reset(mockRegistry);
    reset(mockScope);
  });

  describe("#bindingKey", function () {
    context("when there is bindingKey set", function () {
      it("should return bindingKey", async function () {
        resolver.setBindingKey(["test", "method"]);

        const bindingKey = resolver.bindingKey;
        expect(bindingKey).to.deep.equal(["test", "method"]);
      });
    });
    context("when there is no bindingKey set", function () {
      it("should return undefined", async function () {
        const bindingKey = resolver.bindingKey;
        expect(bindingKey).to.be.undefined;
      });
    });
  });

  describe("#bindingTags", function () {
    context("when there is bindingTags set", function () {
      it("should return bindingTags", async function () {
        resolver.setBindingTags(["tag0", "tag1"]);

        const bindingTags = resolver.bindingTags;
        expect(bindingTags).to.deep.equal(["tag0", "tag1"]);
      });
    });
    context("when there is no bindingTags set", function () {
      it("should return empty bindingTags", async function () {
        const bindingTags = resolver.bindingTags;
        expect(bindingTags).to.deep.equal([]);
      });
    });
  });

  describe("#dependencies", function () {
    context("when there is dependencies set", function () {
      it("should return dependencies", async function () {
        resolver.setDependencies(["dep0", "dep1"]);

        const dependencies = resolver.dependencies;
        expect(dependencies).to.deep.equal(["dep0", "dep1"]);
      });
    });
    context("when there is no dependencies set", function () {
      it("should return empty dependencies", async function () {
        const dependencies = resolver.dependencies;
        expect(dependencies).to.deep.equal([]);
      });
    });
  });

  describe("#registry", function () {
    it("should return registry", async function () {
      const registry = resolver.registry;
      expect(registry).to.not.be.undefined;
    });
  });

  describe("#scope", function () {
    context("when there is scope set", function () {
      it("should return scope", async function () {
        resolver.setScope("singleton");

        const scope = resolver.scope;
        expect(scope).to.equal("singleton");
      });
    });
    context("when there is no scope set", function () {
      it("should return scope", async function () {
        const scope = resolver.scope;
        expect(scope).to.equal("transient");
      });
    });
  });

  describe("#clearBindingKey()", function () {
    context("when there is bindingKey set", function () {
      it("should return self", async function () {
        resolver.setBindingKey(["test", "method"]);

        const self = resolver.clearBindingKey();
        expect(self).to.equal(resolver);
      });
    });
    context("when there is no bindingKey set", function () {
      it("should return self", async function () {
        const self = resolver.clearBindingKey();
        expect(self).to.equal(resolver);
      });
    });
  });

  describe("#clearBindingTag(bindingTag)", function () {
    context("when there is bindingTag set", function () {
      it("should return self", async function () {
        resolver.setBindingTag("tag0");
        resolver.setBindingTag("tag1");

        const self = resolver.clearBindingTag("tag0");
        expect(self).to.equal(resolver);
      });
    });
    context("when there is no bindingTag set", function () {
      it("should return self", async function () {
        const self = resolver.clearBindingTag("tag");
        expect(self).to.equal(resolver);
      });
    });
  });

  describe("#clearBindingTags()", function () {
    context("when there is bindingTag set", function () {
      it("should return self", async function () {
        resolver.setBindingTags(["tag0", "tag1"]);

        const self = resolver.clearBindingTags();
        expect(self).to.equal(resolver);
      });
    });
    context("when there is no bindingTag set", function () {
      it("should return self", async function () {
        const self = resolver.clearBindingTags();
        expect(self).to.equal(resolver);
      });
    });
  });

  describe("#clearDependencies()", function () {
    context("when there is dependencies set", function () {
      it("should return self", async function () {
        resolver.setDependencies(["dep0", "dep1"]);

        const self = resolver.clearDependencies();
        expect(self).to.equal(resolver);
      });
    });
    context("when there is no dependencies set", function () {
      it("should return self", async function () {
        const self = resolver.clearDependencies();
        expect(self).to.equal(resolver);
      });
    });
  });

  describe("#resolve(scope, ...args)", function () {
    it("should throw error", async function () {
      const process = (): unknown => resolver.resolve(scope);
      expect(process).to.throw(ContainerError);
    });
  });

  describe("#resolveDependencies(scope)", function () {
    context("when there is dependencies set", function () {
      it("should return resolved dependencies", async function () {
        resolver.setDependencies(["dep0", "dep1"]);
        when(mockRegistry.resolve<boolean>(scope, "dep0")).thenReturn(true);
        when(mockRegistry.resolve<boolean>(scope, "dep1")).thenReturn(true);

        const resolved = resolver.resolveDependencies(scope);
        expect(resolved).to.deep.equal([true, true]);
      });
    });
    context("when there is no dependencies set", function () {
      it("should return empty resolved dependencies", async function () {
        const resolved = resolver.resolveDependencies(scope);
        expect(resolved).to.deep.equal([]);
      });
    });
  });

  describe("#setBindingKey(bindingKey)", function () {
    context("when there is bindingKey set", function () {
      it("should return self", async function () {
        resolver.setBindingKey(["test", "method"]);

        const self = resolver.setBindingKey(["test", "method"]);
        expect(self).to.equal(resolver);
      });
    });
    context("when there is no bindingKey set", function () {
      it("should return self", async function () {
        const self = resolver.setBindingKey(["test", "method"]);
        expect(self).to.equal(resolver);
      });
    });
  });

  describe("#setBindingTag(bindingTag)", function () {
    context("when there is bindingTag set", function () {
      it("should return self", async function () {
        resolver.setBindingTag("tag0");
        resolver.setBindingTag("tag1");

        const self = resolver.setBindingTag("tag0");
        expect(self).to.equal(resolver);
      });
    });
    context("when there is no bindingTag set", function () {
      it("should return self", async function () {
        const self = resolver.setBindingTag("tag");
        expect(self).to.equal(resolver);
      });
    });
  });

  describe("#setBindingTags(bindingTags)", function () {
    context("when there is bindingTag set", function () {
      it("should return self", async function () {
        resolver.setBindingTags(["tag0", "tag1"]);

        const self = resolver.setBindingTags(["tag0", "tag1"]);
        expect(self).to.equal(resolver);
      });
    });
    context("when there is no bindingTag set", function () {
      it("should return self", async function () {
        const self = resolver.setBindingTags(["tag0", "tag1"]);
        expect(self).to.equal(resolver);
      });
    });
  });

  describe("#setDependencies()", function () {
    context("when there is dependencies set", function () {
      it("should return self", async function () {
        resolver.setDependencies(["dep0", "dep1"]);

        const self = resolver.setDependencies(["dep0", "dep1"]);
        expect(self).to.equal(resolver);
      });
    });
    context("when there is no dependencies set", function () {
      it("should return self", async function () {
        const self = resolver.setDependencies(["dep0", "dep1"]);
        expect(self).to.equal(resolver);
      });
    });
  });

  describe("#setScope(scope)", function () {
    it("should return self", async function () {
      const self = resolver.setScope("singleton");
      expect(self).to.equal(resolver);
    });
  });
});
