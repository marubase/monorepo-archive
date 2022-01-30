import { expect } from "chai";
import { instance, mock, reset, when } from "ts-mockito";
import { RegistryContract } from "../contracts/registry.js";
import { ResolverContract } from "../contracts/resolver.js";
import { ScopeContract } from "../contracts/scope.js";
import { TagResolver } from "./tag-resolver.js";

describe("TagResolver", function () {
  let mockRegistry: RegistryContract;
  let mockResolver: ResolverContract;
  let mockScope: ScopeContract;
  let constantResolver: ResolverContract;
  let registry: RegistryContract;
  let resolver: TagResolver;
  let scope: ScopeContract;
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
