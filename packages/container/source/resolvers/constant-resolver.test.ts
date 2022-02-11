import { expect } from "chai";
import { instance, mock, reset } from "ts-mockito";
import { RegistryInterface } from "../contracts/registry.contract.js";
import { ConstantResolver } from "./constant-resolver.js";

describe("ConstantResolver", function () {
  let mockRegistry: RegistryInterface;
  let registry: RegistryInterface;
  let resolver: ConstantResolver;
  beforeEach(async function () {
    mockRegistry = mock();
    registry = instance(mockRegistry);
    resolver = new ConstantResolver(registry, true);
  });
  afterEach(async function () {
    reset(mockRegistry);
  });

  describe("#resolve(scope, ...args)", function () {
    it("should return resolved instance", async function () {
      const instance = resolver.resolve();
      expect(instance).to.be.true;
    });
  });
});
