import { expect } from "chai";
import { CodeTable } from "../code-table.js";
import { mirrorRun } from "./mirror-run.test.js";
import { StringCodec } from "./string-codec.js";

mirrorRun(function (ascending, toBuffer, toValue) {
  suite(`StringCodec (${ascending ? "asc" : "desc"})`, function () {
    let codec: StringCodec;
    setup(async function () {
      codec = new StringCodec(CodeTable);
    });

    suite("#decode(binary)", function () {
      suite("when given string binary", function () {
        test("should returns string value", async function () {
          const hex = "1b7465737402";
          const binary = toBuffer(hex);
          const decoded = codec.decode(binary);
          expect(decoded).to.equals("test");
        });
      });
      suite("when given special string binary", function () {
        test("should returns string value", async function () {
          const hex = "1b027fc3bd02";
          const binary = toBuffer(hex);
          const decoded = codec.decode(binary);
          expect(decoded).to.equals("\x02\xfd");
        });
      });
    });

    suite("#encode(binaries, meta)", function () {
      suite("when given string value", function () {
        test("should returns string binary", async function () {
          const value = "test";
          const meta = toValue(value);
          const encoded = codec.encode([], meta) as Buffer[];
          expect(encoded).to.have.lengthOf(3);

          const encodedHex = "1b7465737402";
          const encodedBinary = toBuffer(encodedHex);
          expect(Buffer.concat(encoded)).to.deep.equals(encodedBinary);
        });
      });
      suite("when given special string value", function () {
        test("should returns string binary", async function () {
          const value = "\x02\xfd";
          const meta = toValue(value);
          const encoded = codec.encode([], meta) as Buffer[];
          expect(encoded).to.have.lengthOf(3);

          const encodedHex = "1b027fc3bd02";
          const encodedBinary = toBuffer(encodedHex);
          expect(Buffer.concat(encoded)).to.deep.equals(encodedBinary);
        });
      });
    });
  });
});
