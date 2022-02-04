import { expect } from "chai";
import { inject, resolvable } from "./decorator.js";
import { ContainerError } from "./errors/container.error.js";
import { setResolvable } from "./metadata.js";
import { Registry } from "./registry.js";
import { BaseResolver } from "./resolvers/base-resolver.js";

@resolvable()
class Tester {
  protected _date: Date;

  public constructor(@inject(Date) date: Date) {
    this._date = date;
  }

  @resolvable()
  public [Symbol("test")](@inject("random") random: number): string {
    return `${this._date.toISOString()}#${random}`;
  }

  public [Symbol("test2")](random: number): string {
    return `${this._date.toISOString()}#${random}`;
  }

  @resolvable()
  public test(@inject("random") random: number): string {
    return `${this._date.toISOString()}#${random}`;
  }

  public test2(random: number): string {
    return `${this._date.toISOString()}#${random}`;
  }
}

describe("Registry (Bind)", function () {
  let registry: Registry;
  beforeEach(async function () {
    registry = new Registry();
  });

  describe("#bind(bindable).to(class)", function () {
    it("should return resolver", async function () {
      const resolver = registry.bind("test").to(Date);
      expect(resolver).to.be.an.instanceOf(BaseResolver);
    });
  });

  describe("#bind(bindable).toAlias(alias)", function () {
    it("should return resolver", async function () {
      const resolver = registry.bind("test").toAlias("alias");
      expect(resolver).to.be.an.instanceOf(BaseResolver);
    });
  });

  describe("#bind(bindable).toClass(class)", function () {
    context("when target is resolvable", function () {
      it("should return resolver", async function () {
        const resolver = registry.bind("test").toClass(Tester);
        expect(resolver).to.be.an.instanceOf(BaseResolver);
      });
    });
    context("when target is not resolvable", function () {
      it("should return resolver", async function () {
        const resolver = registry.bind("test").toClass(Date);
        expect(resolver).to.be.an.instanceOf(BaseResolver);
      });
    });
  });

  describe("#bind(bindable).toConstant(constant)", function () {
    it("should return resolver", async function () {
      const resolver = registry.bind("test").toConstant(true);
      expect(resolver).to.be.an.instanceOf(BaseResolver);
    });
  });

  describe("#bind(bindable).toFunction(target)", function () {
    context("when target is resolvable", function () {
      it("should return resolver", async function () {
        const test = (): boolean => true;
        setResolvable(test);
        const resolver = registry.bind("test").toFunction(test);
        expect(resolver).to.be.an.instanceOf(BaseResolver);
      });
    });
    context("when target is not resolvable", function () {
      it("should return resolver", async function () {
        const test = (): boolean => true;
        const resolver = registry.bind("test").toFunction(test);
        expect(resolver).to.be.an.instanceOf(BaseResolver);
      });
    });
  });

  describe("#bind(bindable).toInstance(constant)", function () {
    it("should return resolver", async function () {
      const resolver = registry.bind("test").toInstance(true);
      expect(resolver).to.be.an.instanceOf(BaseResolver);
    });
  });

  describe("#bind(bindable).toKey(bindingKey)", function () {
    it("should return resolver", async function () {
      const resolver = registry.bind("test").toKey(["test", "method"]);
      expect(resolver).to.be.an.instanceOf(BaseResolver);
    });
  });

  describe("#bind(bindable).toMethod(target, method)", function () {
    context("when target is resolvable", function () {
      it("should return resolver", async function () {
        const resolver = registry
          .bind("test")
          .toMethod(Tester.prototype, "test");
        expect(resolver).to.be.an.instanceOf(BaseResolver);
      });
    });
    context("when target is not resolvable", function () {
      it("should return resolver", async function () {
        const resolver = registry.bind("test").toMethod(Date, "now");
        expect(resolver).to.be.an.instanceOf(BaseResolver);
      });
    });
  });

  describe("#bind(bindable).toSelf()", function () {
    context("when bindable is class", function () {
      it("should return resolver", async function () {
        const resolver = registry.bind(Date).toSelf();
        expect(resolver).to.be.an.instanceOf(BaseResolver);
      });
    });
    context("when bindable is not class", function () {
      it("should throw error", async function () {
        const process = (): unknown => registry.bind("test").toSelf();
        expect(process).to.throw(ContainerError);
      });
    });
  });

  describe("#bind(bindable).toTag(tag)", function () {
    it("should return resolver", async function () {
      const resolver = registry.bind("test").toTag("tag");
      expect(resolver).to.be.an.instanceOf(BaseResolver);
    });
  });
});
