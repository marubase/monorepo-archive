import { expect } from "chai";
import { anything, instance, mock, reset, when } from "ts-mockito";
import { RegistryInterface } from "../contracts/registry.contract.js";
import { ScopeInterface } from "../contracts/scope.contract.js";
import { MethodResolver } from "./method-resolver.js";

describe("MethodResolver", function () {
  let mockRegistry: RegistryInterface;
  let mockScope: ScopeInterface;
  let registry: RegistryInterface;
  let resolver: MethodResolver;
  let scope: ScopeInterface;
  beforeEach(async function () {
    mockRegistry = mock();
    mockScope = mock();
    registry = instance(mockRegistry);
    scope = instance(mockScope);
  });
  afterEach(async function () {
    reset(mockRegistry);
    reset(mockScope);
  });

  describe("#resolve(scope, ...args)", function () {
    context("when target is ['test', 'method']", function () {
      it("should return resolved instance", async function () {
        const resolved = { test: () => true };
        resolver = new MethodResolver(registry, ["test", "method"], "test");
        when(
          mockRegistry.resolve<typeof resolved>(scope, anything()),
        ).thenReturn(resolved);

        const instance = resolver.resolve(scope);
        expect(instance).to.be.true;
      });
    });
    context("when target is 'test'", function () {
      it("should return resolved instance", async function () {
        const resolved = { test: () => true };
        resolver = new MethodResolver(registry, "test", "test");
        when(
          mockRegistry.resolve<typeof resolved>(scope, anything()),
        ).thenReturn(resolved);

        const instance = resolver.resolve(scope);
        expect(instance).to.be.true;
      });
    });
    context("when target is object", function () {
      it("should return resolved instance", async function () {
        const resolved = { test: () => true };
        resolver = new MethodResolver(registry, resolved, "test");

        const instance = resolver.resolve(scope);
        expect(instance).to.be.true;
      });
    });
  });
});
