import { expect } from "chai";
import { anything, instance, mock, reset, when } from "ts-mockito";
import { RegistryContract } from "../contracts/registry.js";
import { ScopeContract } from "../contracts/scope.js";
import { MethodResolver } from "./method-resolver.js";

describe("MethodResolver", function () {
  let mockRegistry: RegistryContract;
  let mockScope: ScopeContract;
  let registry: RegistryContract;
  let resolver: MethodResolver;
  let scope: ScopeContract;
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
