import { expect } from "chai";
import { instance, mock, reset } from "ts-mockito";
import { BaseBinding } from "./bindings/base-binding.js";
import { BindingContract } from "./contracts/binding.contract.js";
import { CacheContract } from "./contracts/cache.contract.js";
import { DefaultBindingFactory, Resolver } from "./resolver.js";

suite("Resolver", function () {
  let mockBinding: BindingContract;
  let mockCache: CacheContract;
  let binding: BindingContract;
  let cache: CacheContract;
  let resolver: Resolver;
  setup(async function () {
    mockBinding = mock<BindingContract>();
    mockCache = mock<CacheContract>();
    binding = instance(mockBinding);
    cache = instance(mockCache);
    resolver = new Resolver(DefaultBindingFactory);
  });
  teardown(async function () {
    reset(mockBinding);
    reset(mockCache);
  });

  suite("#bind(bindable)", function () {
    suite("when bindable is class", function () {
      test("should return resolve binding", async function () {
        const resolveBinding = resolver.bind(Date);
        expect(resolveBinding).to.have.ownProperty("toAlias");
        expect(resolveBinding).to.have.ownProperty("toClass");
        expect(resolveBinding).to.have.ownProperty("toConstant");
        expect(resolveBinding).to.have.ownProperty("toFunction");
        expect(resolveBinding).to.have.ownProperty("toMethod");
        expect(resolveBinding).to.have.ownProperty("toTag");
      });
    });
    suite("when bindable is string", function () {
      test("should return resolve binding", async function () {
        const resolveBinding = resolver.bind("Date");
        expect(resolveBinding).to.have.ownProperty("toAlias");
        expect(resolveBinding).to.have.ownProperty("toClass");
        expect(resolveBinding).to.have.ownProperty("toConstant");
        expect(resolveBinding).to.have.ownProperty("toFunction");
        expect(resolveBinding).to.have.ownProperty("toMethod");
        expect(resolveBinding).to.have.ownProperty("toTag");
      });
    });
  });

  suite("#bind(bindable).toAlias(alias)", function () {
    test("should return binding", async function () {
      const binding = resolver.bind("key").toAlias("alias");
      expect(binding).to.be.an.instanceOf(BaseBinding);
    });
  });

  suite("#bind(bindable).toClass(target)", function () {
    test("should return binding", async function () {
      const binding = resolver.bind("key").toClass(Date);
      expect(binding).to.be.an.instanceOf(BaseBinding);
    });
  });

  suite("#bind(bindable).toConstant(constant)", function () {
    test("should return binding", async function () {
      const binding = resolver.bind("key").toConstant(true);
      expect(binding).to.be.an.instanceOf(BaseBinding);
    });
  });

  suite("#bind(bindable).toFunction(target)", function () {
    test("should return binding", async function () {
      const binding = resolver.bind("key").toFunction(() => Math.random());
      expect(binding).to.be.an.instanceOf(BaseBinding);
    });
  });

  suite("#bind(bindable).toMethod(target, method)", function () {
    test("should return binding", async function () {
      const binding = resolver.bind("key").toMethod(Date, "now");
      expect(binding).to.be.an.instanceOf(BaseBinding);
    });
  });

  suite("#bind(bindable).toTag(tag)", function () {
    test("should return binding", async function () {
      const binding = resolver.bind("key").toTag("tag");
      expect(binding).to.be.an.instanceOf(BaseBinding);
    });
  });

  suite("#bound(bindable)", function () {
    suite("when bindable is class", function () {
      test("should return predicate", async function () {
        const predicate = resolver.bound(Date);
        expect(predicate).to.be.false;
      });
    });
    suite("when bindable is string", function () {
      test("should return predicate", async function () {
        const predicate = resolver.bound("Date");
        expect(predicate).to.be.false;
      });
    });
  });

  suite("#createConstantBinding(constant)", function () {
    test("should return binding", async function () {
      const binding = resolver.createConstantBinding(true);
      expect(binding).to.be.an.instanceOf(BaseBinding);
    });
  });

  suite("#createConstructorBinding(target)", function () {
    test("should return binding", async function () {
      const binding = resolver.createConstructorBinding(Date);
      expect(binding).to.be.an.instanceOf(BaseBinding);
    });
  });

  suite("#createFunctionBinding(target)", function () {
    test("should return binding", async function () {
      const binding = resolver.createFunctionBinding(() => new Date());
      expect(binding).to.be.an.instanceOf(BaseBinding);
    });
  });

  suite("#createKeyBinding(key)", function () {
    test("should return binding", async function () {
      const binding = resolver.createKeyBinding("key");
      expect(binding).to.be.an.instanceOf(BaseBinding);
    });
  });

  suite("#createMethodBinding(target, method)", function () {
    test("should return binding", async function () {
      const binding = resolver.createMethodBinding(Date, "now");
      expect(binding).to.be.an.instanceOf(BaseBinding);
    });
  });

  suite("#createTagBinding(key)", function () {
    test("should return binding", async function () {
      const binding = resolver.createTagBinding("tag");
      expect(binding).to.be.an.instanceOf(BaseBinding);
    });
  });

  suite("#deindexByKey(binding, key)", function () {
    test("should return self", async function () {
      const self = resolver.deindexByKey(binding, "key");
      expect(self).to.equal(resolver);
    });
  });

  suite("#deindexByTag(binding, tag)", function () {
    suite("when there is tags", function () {
      test("should return self", async function () {
        resolver.indexByTag(binding, "tag");

        const self = resolver.deindexByTag(binding, "tag");
        expect(self).to.equal(resolver);
      });
    });
    suite("when there is no tags", function () {
      test("should return self", async function () {
        const self = resolver.deindexByTag(binding, "tag");
        expect(self).to.equal(resolver);
      });
    });
  });

  suite("#findByKey(key)", function () {
    test("should return binding", async function () {
      const binding = resolver.findByKey("key");
      expect(binding).to.be.undefined;
    });
  });

  suite("#findByTag(tag)", function () {
    suite("when there is tags", function () {
      test("should return bindings", async function () {
        resolver.indexByTag(binding, "tag");

        const bindings = resolver.findByTag("tag");
        expect(bindings).to.deep.equal([binding]);
      });
    });
    suite("when there is no tags", function () {
      test("should return bindings", async function () {
        const bindings = resolver.findByTag("tag");
        expect(bindings).to.deep.equal([]);
      });
    });
  });

  suite("#fork()", function () {
    test("should return fork", async function () {
      const fork = resolver.fork();
      expect(fork).to.be.an.instanceOf(Resolver);
    });
  });

  suite("#indexByKey(binding, key)", function () {
    test("should return self", async function () {
      const self = resolver.indexByKey(binding, "key");
      expect(self).to.equal(resolver);
    });
  });

  suite("#indexByTag(binding, key)", function () {
    suite("when there is tags", function () {
      test("should return self", async function () {
        resolver.indexByTag(binding, "tag");

        const self = resolver.indexByTag(binding, "tag");
        expect(self).to.equal(resolver);
      });
    });
    suite("when there is no tags", function () {
      test("should return self", async function () {
        const self = resolver.indexByTag(binding, "tag");
        expect(self).to.equal(resolver);
      });
    });
  });

  suite("#resolve(cache, resolvable, ...args)", function () {
    suite("when resolvable is class", function () {
      test("should return instance", async function () {
        resolver.bind(Date).toClass(Date);

        const instance = resolver.resolve<Date>(cache, Date);
        expect(instance).to.be.instanceOf(Date);
      });
    });
    suite("when resolvable is string", function () {
      test("should return instance", async function () {
        resolver.bind(Date).toClass(Date);

        const instance = resolver.resolve<Date>(cache, "Date");
        expect(instance).to.be.instanceOf(Date);
      });
    });
  });

  suite("#unbind(bindable)", function () {
    suite("when bindable is class and there is binding", function () {
      test("should return self", async function () {
        resolver.bind(Date).toClass(Date);

        const self = resolver.unbind(Date);
        expect(self).to.equal(resolver);
      });
    });
    suite("when bindable is class and there is no binding", function () {
      test("should return self", async function () {
        const self = resolver.unbind(Date);
        expect(self).to.equal(resolver);
      });
    });
    suite("when bindable is string and there is binding", function () {
      test("should return self", async function () {
        resolver.bind(Date).toClass(Date);

        const self = resolver.unbind("Date");
        expect(self).to.equal(resolver);
      });
    });
    suite("when bindable is string and there is no binding", function () {
      test("should return self", async function () {
        const self = resolver.unbind("Date");
        expect(self).to.equal(resolver);
      });
    });
  });
});
