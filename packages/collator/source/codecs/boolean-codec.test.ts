import { expect } from "chai";
import { CodeTable } from "../code-table.js";
import { BooleanCodec } from "./boolean-codec.js";
import { mirrorRun } from "./mirror-run.test.js";

mirrorRun(function (ascending, toBuffer, toValue) {
  suite(`BooleanCodec (${ascending ? "asc" : "desc"})`, function () {
    let codec: BooleanCodec;
    setup(async function () {
      codec = new BooleanCodec(CodeTable);
    });

    suite("#decode(binary)", function () {
      suite("when given false binary", function () {
        test("should returns false value", async function () {
          const hex = "05";
          const binary = toBuffer(hex);
          const decoded = codec.decode(binary);
          expect(decoded).to.be.false;
        });
      });
      suite("when given true binary", function () {
        test("should returns true value", async function () {
          const hex = "06";
          const binary = toBuffer(hex);
          const decoded = codec.decode(binary);
          expect(decoded).to.be.true;
        });
      });
    });

    suite("#encode(binaries, meta)", function () {
      suite("when given false value", function () {
        test("should returns false binary", async function () {
          const value = false;
          const meta = toValue(value);
          const encoded = codec.encode([], meta) as Buffer[];
          expect(encoded).to.have.lengthOf(1);

          const encodedHex = "05";
          const encodedBinary = toBuffer(encodedHex);
          expect(Buffer.concat(encoded)).to.deep.equals(encodedBinary);
        });
      });
      suite("when given true value", function () {
        test("should returns true binary", async function () {
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
