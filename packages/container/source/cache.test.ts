import { expect } from "chai";
import { Cache } from "./cache.js";

describe("Cache", function () {
  let cache: Cache;
  beforeEach(async function () {
    cache = new Cache();
  });

  describe("#clear(key)", function () {
    context("when there is existing table", function () {
      it("should return self", async function () {
        cache.set(["test", "row0"], true);

        const self = cache.clear(["test", "row0"]);
        expect(self).to.equal(cache);
      });
    });
    context("when there is existing table with multiple row", function () {
      it("should return self", async function () {
        cache.set(["test", "row0"], true);
        cache.set(["test", "row1"], true);

        const self = cache.clear(["test", "row0"]);
        expect(self).to.equal(cache);
      });
    });
    context("when there is no table", function () {
      it("should return self", async function () {
        const self = cache.clear(["test", "row0"]);
        expect(self).to.equal(cache);
      });
    });
  });

  describe("#get(key)", function () {
    context("when there is existing table", function () {
      it("should return value", async function () {
        cache.set(["test", "row0"], true);

        const value = cache.get(["test", "row0"]);
        expect(value).to.be.true;
      });
    });
    context("when there is existing table with multiple row", function () {
      it("should return value", async function () {
        cache.set(["test", "row0"], true);
        cache.set(["test", "row1"], true);

        const value = cache.get(["test", "row0"]);
        expect(value).to.be.true;
      });
    });
    context("when there is no table", function () {
      it("should return undefined", async function () {
        const value = cache.get(["test", "row0"]);
        expect(value).to.be.undefined;
      });
    });
  });

  describe("#has(key)", function () {
    context("when there is existing table", function () {
      it("should return true", async function () {
        cache.set(["test", "row0"], true);

        const value = cache.has(["test", "row0"]);
        expect(value).to.be.true;
      });
    });
    context("when there is existing table with multiple row", function () {
      it("should return true", async function () {
        cache.set(["test", "row0"], true);
        cache.set(["test", "row1"], true);

        const value = cache.has(["test", "row0"]);
        expect(value).to.be.true;
      });
    });
    context("when there is no table", function () {
      it("should return false", async function () {
        const value = cache.has(["test", "row0"]);
        expect(value).to.be.false;
      });
    });
  });

  describe("#set(key, value)", function () {
    context("when there is existing table", function () {
      it("should return self", async function () {
        cache.set(["test", "row0"], true);

        const self = cache.set(["test", "row0"], false);
        expect(self).to.equal(cache);
      });
    });
    context("when there is existing table with multiple row", function () {
      it("should return self", async function () {
        cache.set(["test", "row0"], true);
        cache.set(["test", "row1"], true);

        const self = cache.set(["test", "row0"], false);
        expect(self).to.equal(cache);
      });
    });
    context("when there is no table", function () {
      it("should return self", async function () {
        const self = cache.set(["test", "row0"], false);
        expect(self).to.equal(cache);
      });
    });
  });
});
