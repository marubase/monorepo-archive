import { expect } from "chai";
import { Readable } from "stream";
import { isReadable } from "./is-readable.js";

describe("isReadable(input)", function () {
  context("when input is readable stream", function () {
    it("should return true", async function () {
      const input = new Readable();
      expect(isReadable(input)).to.be.true;
    });
  });
  context("when input is not readable stream", function () {
    it("should return false", async function () {
      expect(isReadable(null)).to.be.false;
    });
  });
});
