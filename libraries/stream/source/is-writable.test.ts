import { expect } from "chai";
import { Writable } from "stream";
import { isWritable } from "./is-writable.js";

describe("isWritable(input)", function () {
  context("when input is writable stream", function () {
    it("should return true", async function () {
      const input = new Writable();
      expect(isWritable(input)).to.be.true;
    });
  });
  context("when input is not writable stream", function () {
    it("should return false", async function () {
      expect(isWritable(null)).to.be.false;
    });
  });
});
