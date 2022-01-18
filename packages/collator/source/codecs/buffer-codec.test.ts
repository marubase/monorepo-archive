import { expect } from "chai";
import { CodeTable } from "../code-table.js";
import { BufferCodec } from "./buffer-codec.js";
import { mirrorRun } from "./mirror-run.test.js";

mirrorRun(function (ascending, toBuffer, toValue) {
  describe(`BufferCoder (${ascending ? "asc" : "desc"})`, function () {
    let coder: BufferCodec;
    beforeEach(async function () {
      coder = new BufferCodec(CodeTable);
    });

    describe("#decode(binary)", function () {
      context("when given buffer binary", function () {
        it("should returns buffer value", async function () {
          const hex = "1a7465737403";
          const binary = toBuffer(hex);
          const decoded = coder.decode(binary);

          const decodedBinary = Buffer.from([116, 101, 115, 116]);
          expect(decoded).to.deep.equals(decodedBinary);
        });
      });
      context("when given special buffer binary", function () {
        it("should returns buffer value", async function () {
          const hex = "1a037Ffc8003";
          const binary = toBuffer(hex);
          const decoded = coder.decode(binary);

          const decodedBinary = Buffer.from([3, 252]);
          expect(decoded).to.deep.equals(decodedBinary);
        });
      });
    });

    describe("#encode(binaries, meta)", function () {
      context("when given buffer value", function () {
        it("should returns buffer binary", async function () {
          const value = Buffer.from([116, 101, 115, 116]);
          const meta = toValue(value);
          const encoded = coder.encode([], meta) as Buffer[];
          expect(encoded).to.have.lengthOf(3);

          const encodedHex = "1a7465737403";
          const encodedBinary = toBuffer(encodedHex);
          expect(Buffer.concat(encoded)).to.deep.equals(encodedBinary);
        });
      });
      context("when given special buffer value", function () {
        it("should returns buffer binary", async function () {
          const value = Buffer.from([3, 252]);
          const meta = toValue(value);
          const encoded = coder.encode([], meta) as Buffer[];
          expect(encoded).to.have.lengthOf(3);

          const encodedHex = "1a037Ffc8003";
          const encodedBinary = toBuffer(encodedHex);
          expect(Buffer.concat(encoded)).to.deep.equals(encodedBinary);
        });
      });
    });
  });
});
