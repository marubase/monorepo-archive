import { expect } from "chai";
import { instance, mock } from "ts-mockito";
import { CacheContract } from "../contracts/cache.contract.js";
import { ResolverContract } from "../contracts/resolver.contract.js";
import { ConstructorBinding } from "./constructor-binding.js";

suite("ConstructorBinding", function () {
  let mockCache: CacheContract;
  let mockResolver: ResolverContract;
  let binding: ConstructorBinding;
  let cache: CacheContract;
  let resolver: ResolverContract;
  setup(async function () {
    mockCache = mock<CacheContract>();
    mockResolver = mock<ResolverContract>();
    cache = instance(mockCache);
    resolver = instance(mockResolver);
    binding = new ConstructorBinding(resolver, Date);
  });

  suite("#resolve(cache, ...args)", function () {
    test("should return instance", async function () {
      const instance = binding.resolve<Date>(cache);
      expect(instance).to.be.an.instanceOf(Date);
    });
  });
});
