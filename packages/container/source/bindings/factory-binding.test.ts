import { expect } from "chai";
import { anything, instance, mock, reset, when } from "ts-mockito";
import { CacheContract } from "../contracts/cache.contract.js";
import {
  ResolveFactory,
  ResolverContract,
} from "../contracts/resolver.contract.js";
import { FactoryBinding } from "./factory-binding.js";

suite("FactoryBinding", function () {
  let binding: FactoryBinding;
  let mockCache: CacheContract;
  let mockResolver: ResolverContract;
  setup(async function () {
    mockCache = mock<CacheContract>();
    mockResolver = mock<ResolverContract>();
    binding = new FactoryBinding(instance(mockResolver), "test");
  });
  teardown(async function () {
    reset(mockCache);
    reset(mockResolver);
  });

  suite("#resolve(cache)", function () {
    suite("when there is args", function () {
      test("should return factory", async function () {
        when(mockResolver.resolve<Date>(anything(), "test", "test")).thenReturn(
          new Date(),
        );

        const factory = binding.resolve<ResolveFactory<Date>>(
          instance(mockCache),
        );
        const actualResult = factory("test");
        expect(actualResult).to.be.an.instanceOf(Date);
      });
    });
    suite("when there is no args", function () {
      test("should return factory", async function () {
        when(mockResolver.resolve<Date>(anything(), "test")).thenReturn(
          new Date(),
        );

        const factory = binding.resolve<ResolveFactory<Date>>(
          instance(mockCache),
        );
        const actualResult = factory();
        expect(actualResult).to.be.an.instanceOf(Date);
      });
    });
  });
});
