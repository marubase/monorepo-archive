import { expect } from "chai";
import { Cache } from "./cache.js";
import { BindingRoot } from "./contracts/registry.js";
import { Scope } from "./scope.js";

describe("Scope", function () {
  let scope: Scope;
  beforeEach(async function () {
    scope = new Scope();
  });

  describe("#container", function () {
    it("should return cache", async function () {
      const cache = scope.container;
      expect(cache).to.be.an.instanceOf(Cache);
    });
  });

  describe("#request", function () {
    it("should return cache", async function () {
      const cache = scope.request;
      expect(cache).to.be.an.instanceOf(Cache);
    });
  });

  describe("#resolvable", function () {
    it("should return resolvable", async function () {
      const resolvable = scope.resolvable;
      expect(resolvable).to.deep.equal([BindingRoot, BindingRoot]);
    });
  });

  describe("#singleton", function () {
    it("should return cache", async function () {
      const cache = scope.singleton;
      expect(cache).to.be.an.instanceOf(Cache);
    });
  });

  describe("#fork('container')", function () {
    it("should return scope", async function () {
      const fork = scope.fork("container");
      expect(fork).to.be.an.instanceOf(Scope);
    });
  });

  describe("#fork('request', [BindingRoot, BindingRoot])", function () {
    it("should return scope", async function () {
      const fork = scope.fork("request", [BindingRoot, BindingRoot]);
      expect(fork).to.be.an.instanceOf(Scope);
    });
  });
});
