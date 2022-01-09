import { expect } from "chai";
import { instance, mock, resetCalls, verify, when } from "ts-mockito";
import { CacheContract } from "../contracts/cache.contract.js";
import { ResolverContract } from "../contracts/resolver.contract.js";
import { BindingError } from "../errors/binding.error.js";
import { BaseBinding } from "./base-binding.js";

suite("BaseBinding", function () {
  let mockCache: CacheContract;
  let mockResolver: ResolverContract;
  let binding: BaseBinding;
  let cache: CacheContract;
  let resolver: ResolverContract;
  setup(async function () {
    mockCache = mock<CacheContract>();
    mockResolver = mock<ResolverContract>();
    cache = instance(mockCache);
    resolver = instance(mockResolver);
    binding = new BaseBinding(resolver);
  });

  suite("#dependencies", function () {
    test("should return dependencies", async function () {
      expect(binding.dependencies).to.deep.equal([]);
    });
  });

  suite("#key", function () {
    test("should return key", async function () {
      expect(binding.key).to.be.undefined;
    });
  });

  suite("#resolver", function () {
    test("should return resolver", async function () {
      expect(binding.resolver).to.equal(resolver);
    });
  });

  suite("#scope", function () {
    test("should return scope", async function () {
      expect(binding.scope).to.equal("transient");
    });
  });

  suite("#tags", function () {
    test("should return tags", async function () {
      expect(binding.tags).to.deep.equal([]);
    });
  });

  suite("#clearDependencies()", function () {
    test("should return self", async function () {
      const self = binding.clearDependencies();
      expect(self).to.equal(binding);
    });
  });

  suite("#clearKey()", function () {
    suite("when there is key", function () {
      test("should return self", async function () {
        binding.setKey("key");
        resetCalls(mockResolver);
        when(mockResolver.deindexByKey(binding, "key")).thenReturn(resolver);

        const self = binding.clearKey();
        expect(self).to.equal(binding);
        verify(mockResolver.deindexByKey(binding, "key")).once();
      });
    });
    suite("when there is no key", function () {
      test("should return self", async function () {
        const self = binding.clearKey();
        expect(self).to.equal(binding);
      });
    });
  });

  suite("#clearTag(tag)", function () {
    test("should return self", async function () {
      when(mockResolver.deindexByTag(binding, "tag")).thenReturn(resolver);

      const self = binding.clearTag("tag");
      expect(self).to.equal(binding);
      verify(mockResolver.deindexByTag(binding, "tag")).once();
    });
  });

  suite("#clearTags()", function () {
    suite("when there is tags", function () {
      test("should return self", async function () {
        binding.setTags(["tag-0", "tag-1"]);
        resetCalls(mockResolver);
        when(mockResolver.deindexByTag(binding, "tag-0")).thenReturn(resolver);
        when(mockResolver.deindexByTag(binding, "tag-1")).thenReturn(resolver);

        const self = binding.clearTags();
        expect(self).to.equal(binding);
        verify(mockResolver.deindexByTag(binding, "tag-0")).once();
        verify(mockResolver.deindexByTag(binding, "tag-1")).once();
      });
    });
    suite("when there is no tags", function () {
      test("should return self", async function () {
        const self = binding.clearTags();
        expect(self).to.equal(binding);
      });
    });
  });

  suite("#hasTag(tag)", function () {
    test("should return boolean", async function () {
      const predicate = binding.hasTag("tag");
      expect(predicate).to.be.false;
    });
  });

  suite("#resolve(cache, ...args)", function () {
    test("should throw error", async function () {
      const process = (): unknown => binding.resolve(cache);
      expect(process).to.throw(BindingError);
    });
  });

  suite("#resolveDependencies(cache, ...args)", function () {
    suite("when there is dependencies", function () {
      test("should return resolved dependencies", async function () {
        binding.setDependencies(["dep-0", "dep-1"]);
        resetCalls(mockResolver);
        when(mockResolver.resolve<Boolean>(cache, "dep-0")).thenReturn(true);
        when(mockResolver.resolve<Boolean>(cache, "dep-1")).thenReturn(true);

        const dependencies = binding.resolveDependencies(cache);
        expect(dependencies).to.deep.equal([true, true]);
        verify(mockResolver.resolve(cache, "dep-0")).once();
        verify(mockResolver.resolve(cache, "dep-1")).once();
      });
    });
    suite("when there is no dependencies", function () {
      test("should return resolved depdencies", async function () {
        const dependencies = binding.resolveDependencies(cache);
        expect(dependencies).to.deep.equal([]);
      });
    });
  });

  suite("#setDependencies(dependencies)", function () {
    test("should return self", async function () {
      const self = binding.setDependencies(["dep-0", "dep-1"]);
      expect(self).to.equal(binding);
    });
  });

  suite("#setKey(key)", function () {
    suite("when there is key", function () {
      test("should return self", async function () {
        binding.setKey("key");
        resetCalls(mockResolver);
        when(mockResolver.deindexByKey(binding, "key")).thenReturn(resolver);
        when(mockResolver.indexByKey(binding, "key")).thenReturn(resolver);

        const self = binding.setKey("key");
        expect(self).to.equal(binding);
        verify(mockResolver.deindexByKey(binding, "key")).once();
        verify(mockResolver.indexByKey(binding, "key")).once();
      });
    });
    suite("when there is no key", function () {
      test("should return self", async function () {
        when(mockResolver.indexByKey(binding, "key")).thenReturn(resolver);

        const self = binding.setKey("key");
        expect(self).to.equal(binding);
        verify(mockResolver.indexByKey(binding, "key")).once();
      });
    });
  });

  suite("#setScope(scope)", function () {
    test("should return self", async function () {
      const self = binding.setScope("singleton");
      expect(self).to.equal(binding);
    });
  });

  suite("#setTag(tag)", function () {
    test("should return self", async function () {
      const self = binding.setTag("tag");
      expect(self).to.equal(binding);
      verify(mockResolver.indexByTag(binding, "tag")).once();
    });
  });

  suite("#setTags(tags)", function () {
    suite("when there is tags", function () {
      test("should return self", async function () {
        binding.setTags(["tag-0", "tag-1"]);
        resetCalls(mockResolver);
        when(mockResolver.deindexByTag(binding, "tag-0")).thenReturn(resolver);
        when(mockResolver.deindexByTag(binding, "tag-1")).thenReturn(resolver);
        when(mockResolver.indexByTag(binding, "tag-0")).thenReturn(resolver);
        when(mockResolver.indexByTag(binding, "tag-1")).thenReturn(resolver);

        const self = binding.setTags(["tag-0", "tag-1"]);
        expect(self).to.equal(binding);
        verify(mockResolver.deindexByTag(binding, "tag-0")).once();
        verify(mockResolver.deindexByTag(binding, "tag-1")).once();
        verify(mockResolver.indexByTag(binding, "tag-0")).once();
        verify(mockResolver.indexByTag(binding, "tag-1")).once();
      });
    });
    suite("when there is no tags", function () {
      test("should return self", async function () {
        when(mockResolver.indexByTag(binding, "tag-0")).thenReturn(resolver);
        when(mockResolver.indexByTag(binding, "tag-1")).thenReturn(resolver);

        const self = binding.setTags(["tag-0", "tag-1"]);
        expect(self).to.equal(binding);
        verify(mockResolver.indexByTag(binding, "tag-0")).once();
        verify(mockResolver.indexByTag(binding, "tag-1")).once();
      });
    });
  });
});
