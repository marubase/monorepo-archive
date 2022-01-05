import { expect } from "chai";
import { instance, mock, reset } from "ts-mockito";
import { CacheContract } from "../contracts/cache.contract.js";
import { ResolverContract } from "../contracts/resolver.contract.js";
import { ConstantBinding } from "./constant-binding.js";

suite("ConstantBinding", function () {
  let binding: ConstantBinding;
  let mockCache: CacheContract;
  let mockResolver: ResolverContract;
  setup(async function () {
    mockCache = mock<CacheContract>();
    mockResolver = mock<ResolverContract>();
    binding = new ConstantBinding(instance(mockResolver), new Date());
  });
  teardown(async function () {
    reset(mockCache);
    reset(mockResolver);
  });

  suite("#resolve(cache, ...args)", function () {
    test("should return constant", async function () {
      const actualResult = binding.resolve(instance(mockCache));
      expect(actualResult).to.be.an.instanceOf(Date);
    });
  });
});
