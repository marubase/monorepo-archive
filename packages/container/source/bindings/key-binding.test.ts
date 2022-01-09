import { expect } from "chai";
import {
  anyOfClass,
  instance,
  mock,
  reset,
  resetCalls,
  verify,
  when,
} from "ts-mockito";
import { CacheContract } from "../contracts/cache.contract.js";
import { ResolverContract } from "../contracts/resolver.contract.js";
import { BindingError } from "../errors/binding.error.js";
import { ConstructorBinding } from "./constructor-binding.js";
import { KeyBinding } from "./key-binding.js";

suite("KeyBinding", function () {
  let mockCache: CacheContract;
  let mockResolver: ResolverContract;
  let binding: KeyBinding;
  let cache: CacheContract;
  let dateBinding: ConstructorBinding;
  let resolver: ResolverContract;
  setup(async function () {
    mockCache = mock<CacheContract>();
    mockResolver = mock<ResolverContract>();
    cache = instance(mockCache);
    resolver = instance(mockResolver);
    binding = new KeyBinding(resolver, "Date");
    dateBinding = new ConstructorBinding(resolver, Date);
  });
  teardown(async function () {
    reset(mockCache);
    reset(mockResolver);
  });

  suite("#resolve(cache, ...args)", function () {
    suite("when there is key binding", function () {
      test("should return instance", async function () {
        when(mockResolver.findByKey("Date")).thenReturn(dateBinding);

        const instance = binding.resolve<Date>(cache);
        expect(instance).to.be.an.instanceOf(Date);
        verify(mockResolver.findByKey("Date")).once();
      });
    });
    suite("when scope is singleton and there is cache", function () {
      test("should return instance", async function () {
        dateBinding.setScope("singleton");
        resetCalls(mockResolver);
        resetCalls(mockCache);
        when(mockResolver.findByKey("Date")).thenReturn(dateBinding);
        when(mockCache.scopeTo("singleton")).thenReturn(cache);
        when(mockCache.has("Date")).thenReturn(true);
        when(mockCache.get("Date")).thenReturn(new Date());

        const instance = binding.resolve<Date>(cache);
        expect(instance).to.be.an.instanceOf(Date);
        verify(mockResolver.findByKey("Date")).once();
        verify(mockCache.scopeTo("singleton")).once();
        verify(mockCache.has("Date")).once();
        verify(mockCache.get("Date")).once();
      });
    });
    suite("when scope is singleton and there is no cache", function () {
      test("should return instance", async function () {
        dateBinding.setScope("singleton");
        resetCalls(mockResolver);
        resetCalls(mockCache);
        when(mockResolver.findByKey("Date")).thenReturn(dateBinding);
        when(mockCache.scopeTo("singleton")).thenReturn(cache);
        when(mockCache.has("Date")).thenReturn(false);
        when(mockCache.set("Date", anyOfClass(Date))).thenReturn(cache);
        when(mockCache.get("Date")).thenReturn(new Date());

        const instance = binding.resolve<Date>(cache);
        expect(instance).to.be.an.instanceOf(Date);
        verify(mockResolver.findByKey("Date")).once();
        verify(mockCache.scopeTo("singleton")).once();
        verify(mockCache.has("Date")).once();
        verify(mockCache.set("Date", anyOfClass(Date))).once();
        verify(mockCache.get("Date")).once();
      });
    });
    suite("when there is no key binding", function () {
      test("should throw error", async function () {
        when(mockResolver.findByKey("Date")).thenReturn(undefined);

        const process = (): unknown => binding.resolve(cache);
        expect(process).to.throw(BindingError);
        verify(mockResolver.findByKey("Date")).once();
      });
    });
  });
});
