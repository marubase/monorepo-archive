import { expect } from "chai";
import { anything, instance, mock, reset, when } from "ts-mockito";
import { RegistryInterface } from "../contracts/registry.contract.js";
import { ScopeInterface } from "../contracts/scope.contract.js";
import { AliasResolver } from "./alias-resolver.js";

describe("AliasResolver", function () {
  let mockRegistry: RegistryInterface;
  let mockScope: ScopeInterface;
  let registry: RegistryInterface;
  let resolver: AliasResolver;
  let scope: ScopeInterface;
  beforeEach(async function () {
    mockRegistry = mock();
    mockScope = mock();
    registry = instance(mockRegistry);
    scope = instance(mockScope);
    resolver = new AliasResolver(registry, "alias");
  });
  afterEach(async function () {
    reset(mockRegistry);
    reset(mockScope);
  });

  describe("#resolve(scope, ...args)", function () {
    context("when scope resolvable is 'test''", function () {
      it("should return resolved instance", async function () {
        when(mockScope.resolvable).thenReturn("test");
        when(mockRegistry.resolve<boolean>(scope, anything())).thenReturn(true);

        const instance = resolver.resolve(scope);
        expect(instance).to.be.true;
      });
    });
    context("when scope resolvable is 'test#method'", function () {
      it("should return resolved instance", async function () {
        when(mockScope.resolvable).thenReturn("test#method");
        when(mockRegistry.resolve<boolean>(scope, anything())).thenReturn(true);

        const instance = resolver.resolve(scope);
        expect(instance).to.be.true;
      });
    });
    context("when scope resolvable is ['test', 'method']", function () {
      it("should return resolved instance", async function () {
        when(mockScope.resolvable).thenReturn(["test", "method"]);
        when(mockRegistry.resolve<boolean>(scope, anything())).thenReturn(true);

        const instance = resolver.resolve(scope);
        expect(instance).to.be.true;
      });
    });
  });
});
