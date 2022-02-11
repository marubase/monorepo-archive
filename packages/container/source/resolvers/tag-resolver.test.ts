import { expect } from "chai";
import { instance, mock, reset, when } from "ts-mockito";
import { RegistryInterface } from "../contracts/registry.contract.js";
import { ResolverInterface } from "../contracts/resolver.contract.js";
import { ScopeInterface } from "../contracts/scope.contract.js";
import { TagResolver } from "./tag-resolver.js";

describe("TagResolver", function () {
  let mockRegistry: RegistryInterface;
  let mockResolver: ResolverInterface;
  let mockScope: ScopeInterface;
  let constantResolver: ResolverInterface;
  let registry: RegistryInterface;
  let resolver: TagResolver;
  let scope: ScopeInterface;
  beforeEach(async function () {
    mockRegistry = mock();
    mockResolver = mock();
    mockScope = mock();
    constantResolver = instance(mockResolver);
    registry = instance(mockRegistry);
    scope = instance(mockScope);
    resolver = new TagResolver(registry, "tag");
  });
  afterEach(async function () {
    reset(mockRegistry);
    reset(mockResolver);
    reset(mockScope);
  });

  describe("#resolve(scope, ...args)", function () {
    it("should return resolved instance", async function () {
      when(mockRegistry.getResolverByTag("tag")).thenReturn([constantResolver]);
      when(mockResolver.resolve<boolean>(scope)).thenReturn(true);

      const instance = resolver.resolve(scope);
      expect(instance).to.deep.equal([true]);
    });
  });
});
