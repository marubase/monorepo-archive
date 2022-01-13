import { expect } from "chai";
import { CodeTable } from "../code-table.js";
import { DateCodec } from "./date-codec.js";
import { mirrorRun } from "./mirror-run.test.js";

mirrorRun(function (ascending, toBuffer, toValue) {
  suite(`DateCodec (${ascending ? "asc" : "desc"})`, function () {
    let codec: DateCodec;
    setup(async function () {
      codec = new DateCodec(CodeTable);
    });

    suite("#decode(binary)", function () {
      suite("when given positive date binary", function () {
        test("should returns date value", async function () {
          const hex = "183ff0000000000000";
          const binary = toBuffer(hex);
          const decodable = codec.decode(binary) as Date;
          expect(decodable.getTime()).to.equals(1);
        });
      });
      suite("when given negative date binary", function () {
        test("should returns date value", async function () {
          const hex = "17c00fffffffffffff";
          const binary = toBuffer(hex);
          const decodable = codec.decode(binary) as Date;
          expect(decodable.getTime()).to.equals(-1);
        });
      });
    });

    suite("#encode(binaries, meta)", function () {
      suite("when given positive date value", function () {
        test("should returns date binary", async function () {
          const value = new Date(1);
          const meta = toValue(value);
          const encoded = codec.encode([], meta) as Buffer[];
          expect(encoded).to.have.lengthOf(2);

          const encodedHex = "183ff0000000000000";
          const encodedBinary = toBuffer(encodedHex);
          expect(Buffer.concat(encoded)).to.deep.equals(encodedBinary);
        });
      });
      suite("when given negative date value", function () {
        test("should returns date binary", async function () {
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
