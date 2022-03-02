import { expect } from "chai";
import { BufferReadable } from "./buffer-readable.js";

describe("BufferReadable", function () {
  describe("static accept(input)", function () {
    context("when input is ArrayBuffer", function () {
      it("should return true", async function () {
        const input = new ArrayBuffer(8);
        const accept = BufferReadable.accept(input);
        expect(accept).to.be.true;
      });
    });
    context("when input is TypedArray", function () {
      it("should return true", async function () {
        const input = Buffer.from([0, 0, 0, 0, 0, 0, 0, 0]);
        const accept = BufferReadable.accept(input);
        expect(accept).to.be.true;
      });
    });
    context("when input is string", function () {
      it("should return true", async function () {
        const input = "";
        const accept = BufferReadable.accept(input);
        expect(accept).to.be.true;
      });
    });
    context("when input is null", function () {
      it("should return false", async function () {
        const input = null;
        const accept = BufferReadable.accept(input);
        expect(accept).to.be.false;
      });
    });
  });

  context("when input is ArrayBuffer", function () {
    it("should stream", async function () {
      const input = new ArrayBuffer(8);
      const readable = new BufferReadable(input, {});

      const chunks: Buffer[] = [];
      for await (const chunk of readable) chunks.push(chunk);

      const buffer = Buffer.concat(chunks);
      expect(buffer.length).to.equal(8);
    });
  });

  context("when input is TypedArray", function () {
    it("should stream", async function () {
      const input = Buffer.from([0, 0, 0, 0, 0, 0, 0, 0]);
      const readable = new BufferReadable(input, {});

      const chunks: Buffer[] = [];
      for await (const chunk of readable) chunks.push(chunk);

      const buffer = Buffer.concat(chunks);
      expect(buffer.length).to.equal(8);
    });
  });

  context("when input is string", function () {
    it("should stream", async function () {
      const input = "hello";
      const readable = new BufferReadable(input, {});

      const chunks: Buffer[] = [];
      for await (const chunk of readable) chunks.push(chunk);

      const buffer = Buffer.concat(chunks);
      expect(buffer.length).to.equal(5);
    });
  });
});
