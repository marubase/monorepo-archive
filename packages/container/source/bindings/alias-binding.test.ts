import { expect } from "chai";
import { anything, instance, mock, reset, when } from "ts-mockito";
import { CacheContract } from "../contracts/cache.contract.js";
import { ResolverContract } from "../contracts/resolver.contract.js";
import { AliasBinding } from "./alias-binding.js";

suite("AliasBinding", function () {
  let binding: AliasBinding;
  let mockCache: CacheContract;
  let mockResolver: ResolverContract;
  setup(async function () {
    mockCache = mock<CacheContract>();
    mockResolver = mock<ResolverContract>();
    binding = new AliasBinding(instance(mockResolver), "test");
  });
  teardown(async function () {
    reset(mockCache);
    reset(mockResolver);
  });

  suite("#resolve(cache, ...args)", function () {
    suite("when given args", function () {
      test("should return result", async function () {
        when(
          mockResolver.resolve<Date>(anything(), anything(), anything()),
        ).thenReturn(new Date());

        const actualResult = binding.resolve(instance(mockCache), true);
        expect(actualResult).to.be.an.instanceOf(Date);
      });
    });
    suite("when given no args", function () {
      test("should return result", async function () {
        when(mockResolver.resolve<Date>(anything(), anything())).thenReturn(
          new Date(),
        );

        const actualResult = binding.resolve(instance(mockCache));
        expect(actualResult).to.be.an.instanceOf(Date);
      });
    });
  });
});
