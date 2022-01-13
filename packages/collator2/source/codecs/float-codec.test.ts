import { expect } from "chai";
import { CodeTable } from "../code-table.js";
import { FloatValue } from "../values/float-value.js";
import { FloatCodec } from "./float-codec.js";
import { mirrorRun } from "./mirror-run.test.js";

mirrorRun(function (ascending, toBuffer, toValue) {
  suite(`FloatCodec (${ascending ? "asc" : "desc"})`, function () {
    let codec: FloatCodec;
    setup(async function () {
      codec = new FloatCodec(CodeTable);
    });

    suite("#decode(binary)", function () {
      suite("when given -float32 binary", function () {
        test("should returns -float32 value", async function () {
          const hex = "13c07fffff";
          const binary = toBuffer(hex);
          const decoded = codec.decode(binary);
          expect(decoded).to.equals(-1);
        });
      });
      suite("when given float32 binary", function () {
        test("should returns float32 value", async function () {
          const hex = "143f800000";
          const binary = toBuffer(hex);
          const decoded = codec.decode(binary);
          expect(decoded).to.equals(1);
        });
      });
      suite("when given -float64 binary", function () {
        test("should returns -float64 value", async function () {
          const hex = "15c00fffffffffffff";
          const binary = toBuffer(hex);
          const decoded = codec.decode(binary);
          expect(decoded).to.equals(-1);
        });
      });
      suite("when given float64 binary", function () {
        test("should returns float64 value", async function () {
          const hex = "163ff0000000000000";
          const binary = toBuffer(hex);
          const decoded = codec.decode(binary);
          expect(decoded).to.equals(1);
        });
      });
      suite("when given -Infinity binary", function () {
        test("should returns -Infinity value", async function () {
          const hex = "15800fffffffffffff";
          const binary = toBuffer(hex);
          const decoded = codec.decode(binary);
          expect(decoded).to.equals(-Infinity);
        });
      });
      suite("when given Infinity binary", function () {
        test("should returns Infinity value", async function () {
          const hex = "167ff0000000000000";
          const binary = toBuffer(hex);
          const decoded = codec.decode(binary);
          expect(decoded).to.equals(Infinity);
        });
      });
    });

    suite("#encode(binaries, meta)", function () {
      suite("when given -float32 value", function () {
        test("should returns -float32 binary", async function () {
          const value = new FloatValue(-1, "float32");
          const meta = toValue(value);
          const encoded = codec.encode([], meta) as Buffer[];
          expect(encoded).to.have.lengthOf(2);

          const encodedHex = "13c07fffff";
          const encodedBinary = toBuffer(encodedHex);
          expect(Buffer.concat(encoded)).to.deep.equals(encodedBinary);
        });
      });
      suite("when given float32 value", function () {
        test("should returns float32 binary", async function () {
          const value = new FloatValue(1, "float32");
          const meta = toValue(value);
          const encoded = codec.encode([], meta) as Buffer[];
          expect(encoded).to.have.lengthOf(2);

          const encodedHex = "143f800000";
          const encodedBinary = toBuffer(encodedHex);
          expect(Buffer.concat(encoded)).to.deep.equals(encodedBinary);
        });
      });
      suite("when given -float64 value", function () {
        test("should returns -float64 binary", async function () {
          const value = new FloatValue(-1, "float64");
          const meta = toValue(value);
          const encoded = codec.encode([], meta) as Buffer[];
          expect(encoded).to.have.lengthOf(2);

          const encodedHex = "15c00fffffffffffff";
          const encodedBinary = toBuffer(encodedHex);
          expect(Buffer.concat(encoded)).to.deep.equals(encodedBinary);
        });
      });
      suite("when given float64 value", function () {
        test("should returns float64 binary", async function () {
          const value = new FloatValue(1, "float64");
          const meta = toValue(value);
          const encoded = codec.encode([], meta) as Buffer[];
          expect(encoded).to.have.lengthOf(2);

          const encodedHex = "163ff0000000000000";
          const encodedBinary = toBuffer(encodedHex);
          expect(Buffer.concat(encoded)).to.deep.equals(encodedBinary);
        });
      });
      suite("when given -Infinity value", function () {
        test("should returns -Infinity binary", async function () {
          const value = -Infinity;
          const meta = toValue(value);
          const encoded = codec.encode([], meta) as Buffer[];
          expect(encoded).to.have.lengthOf(2);

          const encodedHex = "15800fffffffffffff";
          const encodedBinary = toBuffer(encodedHex);
          expect(Buffer.concat(encoded)).to.deep.equals(encodedBinary);
        });
      });
      suite("when given Infinity value", function () {
        test("should returns Infinity binary", async function () {
          const value = Infinity;
          const meta = toValue(value);
          const encoded = codec.encode([], meta) as Buffer[];
          expect(encoded).to.have.lengthOf(2);

          const encodedHex = "167ff0000000000000";
          const encodedBinary = toBuffer(encodedHex);
          expect(Buffer.concat(encoded)).to.deep.equals(encodedBinary);
        });
      });
    });
  });
});
