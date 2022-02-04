import { expect } from "chai";
import { inject, resolvable, tag } from "./decorator.js";
import {
  getResolverDependencies,
  getResolverScope,
  getResolverTags,
  isResolvable,
} from "./metadata.js";

@resolvable()
@tag("class")
class Tester {
  protected _date: Date;

  public constructor(@inject(Date) date: Date) {
    this._date = date;
  }

  @resolvable()
  @tag("method")
  public test(@inject("random") random: number): string {
    return `${this._date.toISOString()}#${random}`;
  }
}

class RawTester {
  protected _date: Date;

  public constructor(date: Date) {
    this._date = date;
  }

  public test(random: number): string {
    return `${this._date.toISOString()}#${random}`;
  }
}

describe("decorator", function () {
  context("when class is decorated with resolvable", function () {
    it("should be resolvable", async function () {
      const resolvable = isResolvable(Tester);
      expect(resolvable).to.be.true;

      const scope = getResolverScope(Tester);
      expect(scope).to.equal("transient");
    });
  });
  context("when class is decorated with tag", function () {
    it("should be tagged", async function () {
      const tags = getResolverTags(Tester);
      expect(Array.from(tags)).to.deep.equal(["class"]);
    });
  });
  context("when class is decorated with inject", function () {
    it("should be injected", async function () {
      const dependencies = getResolverDependencies(Tester);
      expect(dependencies).to.deep.equal([Date]);
    });
  });
  context("when method is decorated with resolvable", function () {
    it("should be resolvable", async function () {
      const resolvable = isResolvable(Tester.prototype, "test");
      expect(resolvable).to.be.true;

      const scope = getResolverScope(Tester.prototype, "test");
      expect(scope).to.equal("transient");
    });
  });
  context("when method is decorated with tag", function () {
    it("should be tagged", async function () {
      const tags = getResolverTags(Tester.prototype, "test");
      expect(Array.from(tags)).to.deep.equal(["method"]);
    });
  });
  context("when method is decorated with inject", function () {
    it("should be injected", async function () {
      const dependencies = getResolverDependencies(Tester.prototype, "test");
      expect(dependencies).to.deep.equal(["random"]);
    });
  });

  context("when class is not decorated with resolvable", function () {
    it("should be injected", async function () {
      const resolvable = isResolvable(RawTester);
      expect(resolvable).to.be.false;

      const scope = getResolverScope(RawTester);
      expect(scope).to.equal("transient");
    });
  });
  context("when class is not decorated with tag", function () {
    it("should be tagged", async function () {
      const tags = getResolverTags(RawTester);
      expect(Array.from(tags)).to.deep.equal([]);
    });
  });
  context("when class is not decorated with inject", function () {
    it("should be injected", async function () {
      const dependencies = getResolverDependencies(RawTester);
      expect(dependencies).to.deep.equal([]);
    });
  });
  context("when method is not decorated with resolvable", function () {
    it("should be resolvable", async function () {
      const resolvable = isResolvable(RawTester.prototype, "test");
      expect(resolvable).to.be.false;

      const scope = getResolverScope(RawTester.prototype, "test");
      expect(scope).to.equal("transient");
    });
  });
  context("when method is not decorated with tag", function () {
    it("should be tagged", async function () {
      const tags = getResolverTags(RawTester.prototype, "test");
      expect(Array.from(tags)).to.deep.equal([]);
    });
  });
  context("when method is not decorated with inject", function () {
    it("should be injected", async function () {
      const dependencies = getResolverDependencies(RawTester.prototype, "test");
      expect(dependencies).to.deep.equal([]);
    });
  });
});
