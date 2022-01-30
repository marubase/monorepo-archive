import { expect } from "chai";
import { instance, mock, reset } from "ts-mockito";
import { RegistryContract } from "../contracts/registry.js";
import { ScopeContract } from "../contracts/scope.js";
import { ClassResolver } from "./class-resolver.js";

describe("ClassResolver", function () {
  let mockRegistry: RegistryContract;
  let mockScope: ScopeContract;
  let registry: RegistryContract;
  let resolver: ClassResolver;
  let scope: ScopeContract;
  beforeEach(async function () {
    mockRegistry = mock();
    mockScope = mock();
    registry = instance(mockRegistry);
    scope = instance(mockScope);
    resolver = new ClassResolver(registry, Date);
  });
  afterEach(async function () {
    reset(mockRegistry);
    reset(mockScope);
  });

  describe("#resolve(scope, ...args)", function () {
    it("should return resolved instance", async function () {
      const instance = resolver.resolve(scope);
      expect(instance).to.be.an.instanceOf(Date);
    });
  });
});
