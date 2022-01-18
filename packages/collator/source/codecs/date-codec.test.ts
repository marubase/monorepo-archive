import { expect } from "chai";
import { CodeTable } from "../code-table.js";
import { DateCodec } from "./date-codec.js";
import { mirrorRun } from "./mirror-run.test.js";

mirrorRun(function (ascending, toBuffer, toValue) {
  describe(`DateCodec (${ascending ? "asc" : "desc"})`, function () {
    let codec: DateCodec;
    beforeEach(async function () {
      codec = new DateCodec(CodeTable);
    });

    describe("#decode(binary)", function () {
      context("when given positive date binary", function () {
        it("should returns date value", async function () {
          const hex = "183ff0000000000000";
          const binary = toBuffer(hex);
          const decodable = codec.decode(binary) as Date;
          expect(decodable.getTime()).to.equals(1);
        });
      });
      context("when given negative date binary", function () {
        it("should returns date value", async function () {
          const hex = "17c00fffffffffffff";
          const binary = toBuffer(hex);
          const decodable = codec.decode(binary) as Date;
          expect(decodable.getTime()).to.equals(-1);
        });
      });
    });

    describe("#encode(binaries, meta)", function () {
      context("when given positive date value", function () {
        it("should returns date binary", async function () {
          const value = new Date(1);
          const meta = toValue(value);
          const encoded = codec.encode([], meta) as Buffer[];
          expect(encoded).to.have.lengthOf(2);

          const encodedHex = "183ff0000000000000";
          const encodedBinary = toBuffer(encodedHex);
          expect(Buffer.concat(encoded)).to.deep.equals(encodedBinary);
        });
      });
      context("when given negative date value", function () {
        it("should returns date binary", async function () {
          const value = new Date(-1);
          const meta = toValue(value);
          const encoded = codec.encode([], meta) as Buffer[];
          expect(encoded).to.have.lengthOf(2);

          const encodedHex = "17c00fffffffffffff";
          const encodedBinary = toBuffer(encodedHex);
          expect(Buffer.concat(encoded)).to.deep.equals(encodedBinary);
        });
      });
    });
  });
});
