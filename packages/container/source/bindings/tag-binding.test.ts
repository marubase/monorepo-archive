import { expect } from "chai";
import { instance, mock, verify, when } from "ts-mockito";
import { CacheContract } from "../contracts/cache.contract.js";
import { ResolverContract } from "../contracts/resolver.contract.js";
import { ConstructorBinding } from "./constructor-binding.js";
import { TagBinding } from "./tag-binding.js";

suite("TagBinding", function () {
  let mockCache: CacheContract;
  let mockResolver: ResolverContract;
  let binding: TagBinding;
  let cache: CacheContract;
  let dateBinding: ConstructorBinding;
  let resolver: ResolverContract;
  setup(async function () {
    mockCache = mock<CacheContract>();
    mockResolver = mock<ResolverContract>();
    cache = instance(mockCache);
    resolver = instance(mockResolver);
    binding = new TagBinding(resolver, "tag");
    dateBinding = new ConstructorBinding(resolver, Date);
  });

  suite("#resolve(cache, ...args)", function () {
    test("should return instances", async function () {
      when(mockResolver.findByTag("tag")).thenReturn([dateBinding]);

      const instances = binding.resolve<Date[]>(cache);
      expect(instances[0]).to.be.an.instanceOf(Date);
      verify(mockResolver.findByTag("tag")).once();
    });
  });
});
