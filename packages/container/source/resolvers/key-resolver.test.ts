import { expect } from "chai";
import { anything, instance, mock, reset, when } from "ts-mockito";
import { CacheInterface } from "../contracts/cache.contract.js";
import {
  BindingKey,
  RegistryInterface,
} from "../contracts/registry.contract.js";
import { ResolverInterface } from "../contracts/resolver.contract.js";
import { ScopeInterface } from "../contracts/scope.contract.js";
import { ContainerError } from "../errors/container.error.js";
import { KeyResolver } from "./key-resolver.js";

describe("KeyResolver", function () {
  let mockCache: CacheInterface;
  let mockConstantResolver: ResolverInterface;
  let mockRegistry: RegistryInterface;
  let mockScope: ScopeInterface;
  let constantResolver: ResolverInterface;
  let cache: CacheInterface;
  let registry: RegistryInterface;
  let resolver: KeyResolver;
  let scope: ScopeInterface;
  beforeEach(async function () {
    mockCache = mock();
    mockConstantResolver = mock();
    mockRegistry = mock();
    mockScope = mock();
    cache = instance(mockCache);
    constantResolver = instance(mockConstantResolver);
    registry = instance(mockRegistry);
    scope = instance(mockScope);
  });
  afterEach(async function () {
    reset(mockCache);
    reset(mockConstantResolver);
    reset(mockRegistry);
    reset(mockScope);
  });

  describe("#resolve(scope, ...args)", function () {
    context("when there is resolver on key", function () {
      it("should return resolved instance", async function () {
        const bindingKey = ["test", "method"] as BindingKey;
        resolver = new KeyResolver(registry, bindingKey);
        when(mockRegistry.getResolverByKey(bindingKey)).thenReturn(
          constantResolver,
        );
        when(mockConstantResolver.scope).thenReturn("transient");
        when(mockConstantResolver.resolve<boolean>(scope)).thenReturn(true);

        const instance = resolver.resolve(scope);
        expect(instance).to.be.true;
      });
    });
    context("when there is resolver on alias", function () {
      it("should return resolved instance", async function () {
        const bindingKey = ["test", "method"] as BindingKey;
        resolver = new KeyResolver(registry, bindingKey);
        when(mockRegistry.getResolverByKey(bindingKey)).thenReturn(undefined);
        when(mockRegistry.getResolverByKey(anything())).thenReturn(
          constantResolver,
        );
        when(mockConstantResolver.scope).thenReturn("transient");
        when(mockConstantResolver.resolve<boolean>(scope)).thenReturn(true);

        const instance = resolver.resolve(scope);
        expect(instance).to.be.true;
      });
    });
    context("when there is no resolver on key ['test', 'method']", function () {
      it("should return resolved instance", async function () {
        const bindingKey = ["test", "method"] as BindingKey;
        resolver = new KeyResolver(registry, bindingKey);
        when(mockRegistry.getResolverByKey(bindingKey)).thenReturn(undefined);
        when(mockRegistry.getResolverByKey(anything())).thenReturn(undefined);

        const process = (): unknown => resolver.resolve(scope);
        expect(process).to.throw(ContainerError);
      });
    });
    context("when there is no resolver on key [symbol, symbol]", function () {
      it("should return resolved instance", async function () {
        const bindingKey = [Symbol("test"), Symbol("method")] as BindingKey;
        resolver = new KeyResolver(registry, bindingKey);
        when(mockRegistry.getResolverByKey(bindingKey)).thenReturn(undefined);
        when(mockRegistry.getResolverByKey(anything())).thenReturn(undefined);

        const process = (): unknown => resolver.resolve(scope);
        expect(process).to.throw(ContainerError);
      });
    });
    context("when there is no resolver on key [Class, 'method']", function () {
      it("should return resolved instance", async function () {
        const bindingKey = [Date, "method"] as BindingKey;
        resolver = new KeyResolver(registry, bindingKey);
        when(mockRegistry.getResolverByKey(bindingKey)).thenReturn(undefined);
        when(mockRegistry.getResolverByKey(anything())).thenReturn(undefined);

        const process = (): unknown => resolver.resolve(scope);
        expect(process).to.throw(ContainerError);
      });
    });
    context("when there is resolver not on cache", function () {
      it("should return resolved instance", async function () {
        const bindingKey = ["test", "method"] as BindingKey;
        resolver = new KeyResolver(registry, bindingKey);
        when(mockRegistry.getResolverByKey(bindingKey)).thenReturn(
          constantResolver,
        );
        when(mockConstantResolver.scope).thenReturn("singleton");
        when(mockScope.singleton).thenReturn(cache);
        when(mockCache.has(anything())).thenReturn(false);
        when(mockCache.set(anything(), anything())).thenReturn(cache);
        when(mockCache.get(anything())).thenReturn(true);
        when(mockConstantResolver.resolve<boolean>(scope)).thenReturn(true);

        const instance = resolver.resolve(scope);
        expect(instance).to.be.true;
      });
    });
    context("when there is resolver on cache", function () {
      it("should return resolved instance", async function () {
        const bindingKey = ["test", "method"] as BindingKey;
        resolver = new KeyResolver(registry, bindingKey);
        when(mockRegistry.getResolverByKey(bindingKey)).thenReturn(
          constantResolver,
        );
        when(mockConstantResolver.scope).thenReturn("singleton");
        when(mockScope.singleton).thenReturn(cache);
        when(mockCache.has(anything())).thenReturn(true);
        when(mockCache.get(anything())).thenReturn(true);

        const instance = resolver.resolve(scope);
        expect(instance).to.be.true;
      });
    });
  });
});
