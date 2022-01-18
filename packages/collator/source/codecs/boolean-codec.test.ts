import { expect } from "chai";
import { CodeTable } from "../code-table.js";
import { BooleanCodec } from "./boolean-codec.js";
import { mirrorRun } from "./mirror-run.test.js";

mirrorRun(function (ascending, toBuffer, toValue) {
  describe(`BooleanCodec (${ascending ? "asc" : "desc"})`, function () {
    let codec: BooleanCodec;
    beforeEach(async function () {
      codec = new BooleanCodec(CodeTable);
    });

    describe("#decode(binary)", function () {
      context("when given false binary", function () {
        it("should returns false value", async function () {
          const hex = "05";
          const binary = toBuffer(hex);
          const decoded = codec.decode(binary);
          expect(decoded).to.be.false;
        });
      });
      context("when given true binary", function () {
        it("should returns true value", async function () {
          const hex = "06";
          const binary = toBuffer(hex);
          const decoded = codec.decode(binary);
          expect(decoded).to.be.true;
        });
      });
    });

    describe("#encode(binaries, meta)", function () {
      context("when given false value", function () {
        it("should returns false binary", async function () {
          const value = false;
          const meta = toValue(value);
          const encoded = codec.encode([], meta) as Buffer[];
          expect(encoded).to.have.lengthOf(1);

          const encodedHex = "05";
          const encodedBinary = toBuffer(encodedHex);
          expect(Buffer.concat(encoded)).to.deep.equals(encodedBinary);
        });
      });
      context("when given true value", function () {
        it("should returns true binary", async function () {
          const value = true;
          const meta = toValue(value);
          const encoded = codec.encode([], meta) as Buffer[];
          expect(encoded).to.have.lengthOf(1);

          const encodedHex = "06";
          const encodedBinary = toBuffer(encodedHex);
          expect(Buffer.concat(encoded)).to.deep.equals(encodedBinary);
        });
      });
    });
  });
});
