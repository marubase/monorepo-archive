import { expect } from "chai";
import { instance, mock, reset } from "ts-mockito";
import { RegistryInterface } from "../contracts/registry.contract.js";
import { ScopeInterface } from "../contracts/scope.contract.js";
import { FunctionResolver } from "./function-resolver.js";

describe("FunctionResolver", function () {
  let mockRegistry: RegistryInterface;
  let mockScope: ScopeInterface;
  let registry: RegistryInterface;
  let resolver: FunctionResolver;
  let scope: ScopeInterface;
  beforeEach(async function () {
    mockRegistry = mock();
    mockScope = mock();
    registry = instance(mockRegistry);
    scope = instance(mockScope);
    resolver = new FunctionResolver(registry, () => true);
  });
  afterEach(async function () {
    reset(mockRegistry);
    reset(mockScope);
  });

  describe("#resolve(scope, ...args)", function () {
    it("should return resolved instance", async function () {
      const instance = resolver.resolve(scope);
      expect(instance).to.be.true;
    });
  });
});
