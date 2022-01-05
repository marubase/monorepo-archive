import { expect } from "chai";
import { anything, instance, mock, when } from "ts-mockito";
import { BindingContract } from "../contracts/binding.contract.js";
import { CacheContract } from "../contracts/cache.contract.js";
import { ResolverContract } from "../contracts/resolver.contract.js";
import { TagBinding } from "./tag-binding.js";

suite("TagBinding", function () {
  let binding: TagBinding;
  let mockBinding: BindingContract;
  let mockCache: CacheContract;
  let mockResolver: ResolverContract;
  setup(async function () {
    mockBinding = mock<BindingContract>();
    mockCache = mock<CacheContract>();
    mockResolver = mock<ResolverContract>();
    binding = new TagBinding(instance(mockResolver), "test");
  });

  suite("#resolve(cache, ...args)", function () {
    test("should return result", async function () {
      when(mockResolver.getBindingByTags("test")).thenReturn([
        instance(mockBinding),
      ]);
      when(mockBinding.resolve<Date>(anything())).thenReturn(new Date());

      const actualResult = binding.resolve<Array<Date>>(mockCache);
      expect(actualResult).to.be.an("array");
      expect(actualResult[0]).to.be.an.instanceOf(Date);
    });
  });
});
