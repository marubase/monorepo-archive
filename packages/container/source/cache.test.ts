import { expect } from "chai";
import { instance, mock, resetCalls, verify, when } from "ts-mockito";
import { Cache } from "./cache.js";

suite("Cache", function () {
  let mockParent: Cache;
  let cache: Cache;
  let parent: Cache;
  setup(async function () {
    mockParent = mock(Cache);
    parent = instance(mockParent);
    cache = new Cache();
  });

  suite("#parent", function () {
    test("should return parent", async function () {
      expect(cache.parent).to.be.undefined;
    });
  });

  suite("#type", function () {
    test("should return type", async function () {
      expect(cache.type).to.equal("container");
    });
  });

  suite("#fork(type)", function () {
    test("should return fork", async function () {
      const fork = cache.fork("container");
      expect(fork).to.be.an.instanceOf(Cache);
    });
  });

  suite("#scopeTo(scope)", function () {
    suite("when scope is container and type is container", function () {
      test("should return cache", async function () {
        cache.setParent(parent);
        cache.setType("container");

        const scope = cache.scopeTo("container");
        expect(scope).to.equal(cache);
      });
    });
    suite("when scope is container and type is request", function () {
      test("should return cache", async function () {
        cache.setParent(parent);
        cache.setType("request");
        resetCalls(mockParent);
        when(mockParent.scopeTo("container")).thenReturn(parent);

        const scope = cache.scopeTo("container");
        expect(scope).to.not.equal(cache);
        verify(mockParent.scopeTo("container")).once();
      });
    });
    suite("when scope is singleton and there is parent", function () {
      test("should return cache", async function () {
        cache.setParent(parent);
        resetCalls(mockParent);
        when(mockParent.scopeTo("singleton")).thenReturn(parent);

        const scope = cache.scopeTo("singleton");
        expect(scope).to.not.equal(cache);
        verify(mockParent.scopeTo("singleton")).once();
      });
    });
    suite("when scope is singleton and there is no parent", function () {
      test("should return cache", async function () {
        const scope = cache.scopeTo("singleton");
        expect(scope).to.equal(cache);
      });
    });
    suite("when scope is request", function () {
      test("should return cache", async function () {
        const scope = cache.scopeTo("request");
        expect(scope).to.equal(cache);
      });
    });
  });

  suite("#setParent(parent)", function () {
    test("should return self", async function () {
      const self = cache.setParent(parent);
      expect(self).to.equal(cache);
    });
  });

  suite("#setType(type)", function () {
    test("should return self", async function () {
      const self = cache.setType("container");
      expect(self).to.equal(cache);
    });
  });
});
