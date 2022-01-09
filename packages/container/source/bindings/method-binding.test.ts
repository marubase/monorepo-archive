import { expect } from "chai";
import { instance, mock } from "ts-mockito";
import { CacheContract } from "../contracts/cache.contract.js";
import { ResolverContract } from "../contracts/resolver.contract.js";
import { MethodBinding } from "./method-binding.js";

suite("MethodBinding", function () {
  let mockCache: CacheContract;
  let mockResolver: ResolverContract;
  let binding: MethodBinding;
  let cache: CacheContract;
  let resolver: ResolverContract;
  setup(async function () {
    mockCache = mock<CacheContract>();
    mockResolver = mock<ResolverContract>();
    cache = instance(mockCache);
    resolver = instance(mockResolver);
    binding = new MethodBinding(resolver, Date, "now");
  });

  suite("#resolve(cache, ...args)", function () {
    test("should return instance", async function () {
      const instance = binding.resolve<number>(cache);
      expect(instance).to.be.a("number");
    });
  });
});
