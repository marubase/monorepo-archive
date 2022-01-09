import { expect } from "chai";
import { instance, mock, reset } from "ts-mockito";
import { CacheContract } from "../contracts/cache.contract.js";
import { ResolverContract } from "../contracts/resolver.contract.js";
import { ConstantBinding } from "./constant-binding.js";

suite("ConstantBinding", function () {
  let mockCache: CacheContract;
  let mockResolver: ResolverContract;
  let binding: ConstantBinding;
  let cache: CacheContract;
  let resolver: ResolverContract;
  setup(async function () {
    mockCache = mock<CacheContract>();
    mockResolver = mock<ResolverContract>();
    cache = instance(mockCache);
    resolver = instance(mockResolver);
    binding = new ConstantBinding(resolver, true);
  });
  teardown(async function () {
    reset(mockCache);
    reset(mockResolver);
  });

  suite("#resolve(cache, ...args)", function () {
    test("should return constant", async function () {
      const instance = binding.resolve(cache);
      expect(instance).to.equal(true);
    });
  });
});
