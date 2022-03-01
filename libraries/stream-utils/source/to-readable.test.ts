import { expect } from "chai";
import { Readable } from "stream";
import { toReadable } from "./to-readable.js";

describe("toReadable(input, options)", function () {
  context("when input is acceptable by buffer readable", function () {
    it("should return stream", async function () {
      const input = Buffer.from([0, 0, 0, 0, 0, 0, 0, 0]);
      const stream = toReadable(input, {});
      expect(stream).to.be.an.instanceOf(Readable);
    });
  });

  context("when input is acceptable by iterator readable", function () {
    it("should return stream", async function () {
      const input = [0, 0, 0, 0, 0, 0, 0, 0];
      const stream = toReadable(input, {});
      expect(stream).to.be.an.instanceOf(Readable);
    });
  });

  context("when input is not acceptable", function () {
    it("should throw error", async function () {
      const process = (): unknown => toReadable({});
      expect(process).to.throw(TypeError);
    });
  });
});
