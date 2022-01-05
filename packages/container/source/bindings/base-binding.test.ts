import { expect } from "chai";
import { anything, instance, mock, reset, when } from "ts-mockito";
import {
  BindingKey,
  BindingScope,
  BindingTags,
} from "../contracts/binding.contract.js";
import { CacheContract } from "../contracts/cache.contract.js";
import { ResolverContract } from "../contracts/resolver.contract.js";
import { BindingError } from "../errors/binding.error.js";
import { BaseBinding } from "./base-binding.js";

suite("BaseBinding", function () {
  let binding: BaseBinding;
  let mockedResolver: ResolverContract;
  setup(async function () {
    mockedResolver = mock<ResolverContract>();

    binding = new BaseBinding(instance(mockedResolver));
  });
  teardown(async function () {
    reset(mockedResolver);
  });

  suite("#getArgs()", function () {
    test("should return args", async function () {
      const expectedArgs: Array<unknown> = [];
      const actualArgs = binding.getArgs();
      expect(actualArgs).to.deep.equal(expectedArgs);
    });
  });

  suite("#getDependencies()", function () {
    test("should return dependencies", async function () {
      const expectedDependencies: Array<unknown> = [];
      const actualDependencies = binding.getDependencies();
      expect(actualDependencies).to.deep.equal(expectedDependencies);
    });
  });

  suite("#getKey()", function () {
    test("should return key", async function () {
      const actualKey = binding.getKey();
      expect(actualKey).to.be.undefined;
    });
  });

  suite("#getResolver()", function () {
    test("should return resolver", async function () {
      const actualResolver = binding.getResolver();
      expect(actualResolver).to.not.be.undefined;
    });
  });

  suite("#getScope()", function () {
    test("should return scope", async function () {
      const expectedScope: BindingScope = "transient";
      const actualScope = binding.getScope();
      expect(actualScope).to.equal(expectedScope);
    });
  });

  suite("#getTags()", function () {
    test("should return tags", async function () {
      const expectedTags: BindingTags = [];
      const actualTags = binding.getTags();
      expect(actualTags).to.deep.equal(expectedTags);
    });
  });

  suite("#resolve(cache, ...args)", function () {
    test("should throw error", async function () {
      const mockedCache = mock<CacheContract>();
      const cache = instance(mockedCache);
      const process = (): unknown => binding.resolve(cache);
      expect(process).to.throw(BindingError);
    });
  });

  suite("#resolveDependencies(cache)", function () {
    test("should return resolved dependencies", async function () {
      when(mockedResolver.resolve<boolean>(anything(), anything())).thenReturn(
        true,
      );
      binding.setDependencies(["test", "test"]);

      const mockedCache = mock<CacheContract>();
      const cache = instance(mockedCache);

      const expectedDependencies = [true, true];
      const actualDependencies = binding.resolveDependencies(cache);
      expect(actualDependencies).to.deep.equal(expectedDependencies);
    });
  });

  suite("#setArgs(args)", function () {
    test("should return self", async function () {
      const actualSelf = binding.setArgs([]);
      expect(actualSelf).to.equal(binding);
    });
  });

  suite("#setDependencies(dependencies)", function () {
    test("should return self", async function () {
      const actualSelf = binding.setDependencies([]);
      expect(actualSelf).to.equal(binding);
    });
  });

  suite("#setKey(key)", function () {
    suite("when input key is string", function () {
      test("should return self", async function () {
        const inputKey: BindingKey = "key";
        const actualSelf = binding.setKey(inputKey);
        expect(actualSelf).to.equal(binding);
      });
    });
    suite("when input key is symbol", function () {
      test("should return self", async function () {
        const inputKey: BindingKey = Symbol("key");
        const actualSelf = binding.setKey(inputKey);
        expect(actualSelf).to.equal(binding);
      });
    });
    suite("when input key is undefined", function () {
      test("should return self", async function () {
        const actualSelf = binding.setKey();
        expect(actualSelf).to.equal(binding);
      });
    });
    suite("when key already exist", function () {
      test("should throw error", async function () {
        when(mockedResolver.hasBindingByKey(anything())).thenReturn(true);

        const inputKey = "key";
        const process = (): unknown => binding.setKey(inputKey);
        expect(process).to.throw(BindingError);
      });
    });
    suite("when internal key is set", function () {
      test("should return self", async function () {
        const inputKey: BindingKey = "key";
        binding.setKey(inputKey);

        const actualSelf = binding.setKey(inputKey);
        expect(actualSelf).to.equal(binding);
      });
    });
  });

  suite("#setScope(scope)", function () {
    test("should return self", async function () {
      const actualSelf = binding.setScope("container");
      expect(actualSelf).to.equal(binding);
    });
  });

  suite("#setTags(tags)", function () {
    test("should return self", async function () {
      binding.setTags(["test", "test2"]);

      const actualSelf = binding.setTags(["test", "test2"]);
      expect(actualSelf).to.equal(binding);
    });
  });
});
