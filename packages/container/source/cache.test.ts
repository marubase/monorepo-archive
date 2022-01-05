import { expect } from "chai";
import { Cache } from "./cache.js";
import { CacheKey, CacheType } from "./contracts/cache.contract.js";
import { CacheError } from "./errors/cache-error.js";

suite("Cache", function () {
  let cache: Cache;
  setup(async function () {
    cache = new Cache();
  });

  suite("#clearEntry(key)", function () {
    suite("when input key is string", function () {
      let inputKey: CacheKey;
      setup(async function () {
        inputKey = "key";
      });
      suite("and there is entry", function () {
        setup(async function () {
          cache.setEntry(inputKey, "value");
        });
        test("should return self", async function () {
          const actualSelf = cache.clearEntry(inputKey);
          expect(actualSelf).to.equal(cache);
        });
      });
      suite("and there is no entry", function () {
        test("should throw error", async function () {
          const process = (): unknown => cache.clearEntry(inputKey);
          expect(process).to.throw(CacheError);
        });
      });
    });
    suite("when input key is symbol", function () {
      let inputKey: CacheKey;
      setup(async function () {
        inputKey = Symbol("key");
      });
      suite("and there is entry", function () {
        setup(async function () {
          cache.setEntry(inputKey, "value");
        });
        test("should return self", async function () {
          const actualSelf = cache.clearEntry(inputKey);
          expect(actualSelf).to.equal(cache);
        });
      });
      suite("and there is no entry", function () {
        test("should throw error", async function () {
          const process = (): unknown => cache.clearEntry(inputKey);
          expect(process).to.throw(CacheError);
        });
      });
    });
  });

  suite("#fork(type)", function () {
    suite("when input type is 'container'", function () {
      let inputType: CacheType;
      setup(async function () {
        inputType = "container";
      });
      test("should return cache instance", async function () {
        const actualInstance = cache.fork(inputType);
        expect(actualInstance).to.be.an.instanceOf(Cache);
      });
    });
    suite("when input type is 'request'", function () {
      let inputType: CacheType;
      setup(async function () {
        inputType = "request";
      });
      test("should return cache instance", async function () {
        const actualInstance = cache.fork(inputType);
        expect(actualInstance).to.be.an.instanceOf(Cache);
      });
    });
  });

  suite("#getEntry(key)", function () {
    suite("when input key is string", function () {
      let inputKey: CacheKey;
      setup(async function () {
        inputKey = "key";
      });
      suite("and there is entry", function () {
        setup(async function () {
          cache.setEntry(inputKey, "value");
        });
        test("should return value", async function () {
          const expectedValue = "value";
          const actualValue = cache.getEntry(inputKey);
          expect(actualValue).to.equal(expectedValue);
        });
      });
      suite("and there is no entry", function () {
        test("should throw error", async function () {
          const process = (): unknown => cache.getEntry(inputKey);
          expect(process).to.throw(CacheError);
        });
      });
    });
    suite("when input key is symbol", function () {
      let inputKey: CacheKey;
      setup(async function () {
        inputKey = Symbol("key");
      });
      suite("and there is entry", function () {
        setup(async function () {
          cache.setEntry(inputKey, "value");
        });
        test("should return value", async function () {
          const expectedValue = "value";
          const actualValue = cache.getEntry(inputKey);
          expect(actualValue).to.equal(expectedValue);
        });
      });
      suite("and there is no entry", function () {
        test("should throw error", async function () {
          const process = (): unknown => cache.getEntry(inputKey);
          expect(process).to.throw(CacheError);
        });
      });
    });
  });

  suite("#getParent()", function () {
    suite("when invoke from root", function () {
      test("should return undefined", async function () {
        const actualParent = cache.getParent();
        expect(actualParent).to.be.undefined;
      });
    });
    suite("when invoke from fork", function () {
      test("should return parent", async function () {
        const forkInstance = cache.fork("container");
        const actualParent = forkInstance.getParent();
        expect(actualParent).to.equal(cache);
      });
    });
  });

  suite("#getRecord()", function () {
    suite("when invoke from root", function () {
      suite("and there is entries", function () {
        let stateRecord: Record<CacheKey, unknown>;
        setup(async function () {
          stateRecord = {
            [Symbol("key-0")]: "value-0",
            [Symbol("key-1")]: "value-1",
            [Symbol("key-2")]: "value-2",
            "key-0": "value-0",
            "key-1": "value-1",
            "key-2": "value-2",
          };
          for (const key in stateRecord) cache.setEntry(key, stateRecord[key]);
        });
        test("should return record", async function () {
          const actualRecord = cache.getRecord();
          expect(actualRecord).to.deep.equal(stateRecord);
        });
      });
      suite("and there is no entries", function () {
        test("should return empty record", async function () {
          const actualRecord = cache.getRecord();
          expect(actualRecord).to.deep.equal({});
        });
      });
    });
    suite("when invoke from fork", function () {
      suite("and there is entries", function () {
        let stateRecord: Record<CacheKey, unknown>;
        setup(async function () {
          stateRecord = {
            [Symbol("key-0")]: "value-0",
            [Symbol("key-1")]: "value-1",
            [Symbol("key-2")]: "value-2",
            "key-0": "value-0",
            "key-1": "value-1",
            "key-2": "value-2",
          };
          for (const key in stateRecord) cache.setEntry(key, stateRecord[key]);
        });
        test("should return record", async function () {
          const forkInstance = cache.fork("container");
          const actualRecord = forkInstance.getRecord();
          expect(actualRecord).to.deep.equal(stateRecord);
        });
      });
      suite("and there is no entries", function () {
        test("should return empty record", async function () {
          const forkInstance = cache.fork("container");
          const actualRecord = forkInstance.getRecord();
          expect(actualRecord).to.deep.equal({});
        });
      });
    });
  });

  suite("#getType()", function () {
    suite("when invoke from container cache", function () {
      test("should return 'container'", async function () {
        const expectedType = "container";
        const forkInstance = cache.fork("container");
        const actualType = forkInstance.getType();
        expect(actualType).to.equal(expectedType);
      });
    });
    suite("when invoke from request cache", function () {
      test("should return 'request'", async function () {
        const expectedType = "request";
        const forkInstance = cache.fork("request");
        const actualType = forkInstance.getType();
        expect(actualType).to.equal(expectedType);
      });
    });
  });

  suite("#hasEntry(key)", function () {
    suite("when input key is string", function () {
      let inputKey: CacheKey;
      setup(async function () {
        inputKey = "key";
      });
      suite("and there is entry", function () {
        setup(async function () {
          cache.setEntry(inputKey, "value");
        });
        test("should return true", async function () {
          const actualResult = cache.hasEntry(inputKey);
          expect(actualResult).to.be.true;
        });
      });
      suite("and there is no entry", function () {
        test("should return false", async function () {
          const actualResult = cache.hasEntry(inputKey);
          expect(actualResult).to.be.false;
        });
      });
    });
    suite("when input key is symbol", function () {
      let inputKey: CacheKey;
      setup(async function () {
        inputKey = Symbol("key");
      });
      suite("and there is entry", function () {
        setup(async function () {
          cache.setEntry(inputKey, "value");
        });
        test("should return true", async function () {
          const actualResult = cache.hasEntry(inputKey);
          expect(actualResult).to.be.true;
        });
      });
      suite("and there is no entry", function () {
        test("should return false", async function () {
          const actualResult = cache.hasEntry(inputKey);
          expect(actualResult).to.be.false;
        });
      });
    });
  });

  suite("#scopeTo(scope)", function () {
    suite("when input scope is 'container'", function () {
      suite("and invoke from root", function () {
        test("should return self", async function () {
          const actualInstance = cache.scopeTo("container");
          expect(actualInstance).to.equal(cache);
        });
      });
      suite("and invoke from fork", function () {
        test("should return self", async function () {
          const forkInstance = cache.fork("container");
          const actualInstance = forkInstance.scopeTo("container");
          expect(actualInstance).to.equal(forkInstance);
        });
      });
      suite("and invoke from request", function () {
        test("should return fork", async function () {
          const forkInstance = cache.fork("container");
          const requestInstance = forkInstance.fork("request");
          const actualInstance = requestInstance.scopeTo("container");
          expect(actualInstance).to.equal(forkInstance);
        });
      });
      suite("and invoke from sub-request", function () {
        test("should return fork", async function () {
          const forkInstance = cache.fork("container");
          const requestInstance = forkInstance.fork("request");
          const subRequestInstance = requestInstance.fork("request");
          const actualInstance = subRequestInstance.scopeTo("container");
          expect(actualInstance).to.equal(forkInstance);
        });
      });
    });
    suite("when input scope is 'request'", function () {
      suite("and invoke from root", function () {
        test("should return self", async function () {
          const actualInstance = cache.scopeTo("request");
          expect(actualInstance).to.equal(cache);
        });
      });
      suite("and invoke from fork", function () {
        test("should return self", async function () {
          const forkInstance = cache.fork("container");
          const actualInstance = forkInstance.scopeTo("request");
          expect(actualInstance).to.equal(forkInstance);
        });
      });
      suite("and invoke from request", function () {
        test("should return self", async function () {
          const forkInstance = cache.fork("container");
          const requestInstance = forkInstance.fork("request");
          const actualInstance = requestInstance.scopeTo("request");
          expect(actualInstance).to.equal(requestInstance);
        });
      });
      suite("and invoke from sub-request", function () {
        test("should return request", async function () {
          const forkInstance = cache.fork("container");
          const requestInstance = forkInstance.fork("request");
          const subRequestInstance = requestInstance.fork("request");
          const actualInstance = subRequestInstance.scopeTo("request");
          expect(actualInstance).to.equal(requestInstance);
        });
      });
    });
    suite("when input scope is 'singleton'", function () {
      suite("and invoke from root", function () {
        test("should return self", async function () {
          const actualInstance = cache.scopeTo("singleton");
          expect(actualInstance).to.equal(cache);
        });
      });
      suite("and invoke from fork", function () {
        test("should return root", async function () {
          const forkInstance = cache.fork("container");
          const actualInstance = forkInstance.scopeTo("singleton");
          expect(actualInstance).to.equal(cache);
        });
      });
      suite("and invoke from request", function () {
        test("should return root", async function () {
          const forkInstance = cache.fork("container");
          const requestInstance = forkInstance.fork("request");
          const actualInstance = requestInstance.scopeTo("singleton");
          expect(actualInstance).to.equal(cache);
        });
      });
      suite("and invoke from sub-request", function () {
        test("should return root", async function () {
          const forkInstance = cache.fork("container");
          const requestInstance = forkInstance.fork("request");
          const subRequestInstance = requestInstance.fork("request");
          const actualInstance = subRequestInstance.scopeTo("singleton");
          expect(actualInstance).to.equal(cache);
        });
      });
    });
    suite("when input scope is 'transient'", function () {
      suite("and invoke from root", function () {
        test("should return self", async function () {
          const actualInstance = cache.scopeTo("transient");
          expect(actualInstance).to.equal(cache);
        });
      });
      suite("and invoke from fork", function () {
        test("should return self", async function () {
          const forkInstance = cache.fork("container");
          const actualInstance = forkInstance.scopeTo("transient");
          expect(actualInstance).to.equal(forkInstance);
        });
      });
      suite("and invoke from request", function () {
        test("should return self", async function () {
          const forkInstance = cache.fork("container");
          const requestInstance = forkInstance.fork("request");
          const actualInstance = requestInstance.scopeTo("transient");
          expect(actualInstance).to.equal(requestInstance);
        });
      });
      suite("and invoke from sub-request", function () {
        test("should return self", async function () {
          const forkInstance = cache.fork("container");
          const requestInstance = forkInstance.fork("request");
          const subRequestInstance = requestInstance.fork("request");
          const actualInstance = subRequestInstance.scopeTo("transient");
          expect(actualInstance).to.equal(subRequestInstance);
        });
      });
    });
  });

  suite("#setEntry(key)", function () {
    suite("when input key is string", function () {
      let inputKey: CacheKey;
      setup(async function () {
        inputKey = "key";
      });
      suite("and there is entry", function () {
        setup(async function () {
          cache.setEntry(inputKey, "value");
        });
        test("should throw error", async function () {
          const process = (): unknown => cache.setEntry(inputKey, "value");
          expect(process).to.throw(CacheError);
        });
      });
      suite("and there is no entry", function () {
        test("should return self", async function () {
          const actualSelf = cache.setEntry(inputKey, "value");
          expect(actualSelf).to.equal(cache);
        });
      });
    });
    suite("when input key is symbol", function () {
      let inputKey: CacheKey;
      setup(async function () {
        inputKey = Symbol("key");
      });
      suite("and there is entry", function () {
        setup(async function () {
          cache.setEntry(inputKey, "value");
        });
        test("should throw error", async function () {
          const process = (): unknown => cache.setEntry(inputKey, "value");
          expect(process).to.throw(CacheError);
        });
      });
      suite("and there is no entry", function () {
        test("should return self", async function () {
          const actualSelf = cache.setEntry(inputKey, "value");
          expect(actualSelf).to.equal(cache);
        });
      });
    });
  });
});
