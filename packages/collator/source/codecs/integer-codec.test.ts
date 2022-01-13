import { expect } from "chai";
import { CodeTable } from "../code-table.js";
import { IntegerValue } from "../values/integer-value.js";
import { IntegerCodec } from "./integer-codec.js";
import { mirrorRun } from "./mirror-run.test.js";

mirrorRun(function (ascending, toBuffer, toValue) {
  suite(`IntegerCodec (${ascending ? "asc" : "desc"})`, function () {
    let codec: IntegerCodec;
    setup(async function () {
      codec = new IntegerCodec(CodeTable);
    });

    suite("#decode(binary)", function () {
      suite("when given -int8 binary", function () {
        test("should returns -int8 value", async function () {
          const hex = "07ff";
          const binary = toBuffer(hex);
          const decoded = codec.decode(binary);
          expect(decoded).to.equals(-1);
        });
      });
      suite("when given int8 binary", function () {
        test("should returns int8 value", async function () {
          const hex = "0801";
          const binary = toBuffer(hex);
          const decoded = codec.decode(binary);
          expect(decoded).to.equals(1);
        });
      });
      suite("when given uint8 binary", function () {
        test("should returns uint8 value", async function () {
          const hex = "0901";
          const binary = toBuffer(hex);
          const decoded = codec.decode(binary);
          expect(decoded).to.equals(1);
        });
      });
      suite("when given -int16 binary", function () {
        test("should returns -int16 value", async function () {
          const hex = "0affff";
          const binary = toBuffer(hex);
          const decoded = codec.decode(binary);
          expect(decoded).to.equals(-1);
        });
      });
      suite("when given int16 binary", function () {
        test("should returns int16 value", async function () {
          const hex = "0b0001";
          const binary = toBuffer(hex);
          const decoded = codec.decode(binary);
          expect(decoded).to.equals(1);
        });
      });
      suite("when given uint16 binary", function () {
        test("should returns uint16 value", async function () {
          const hex = "0c0001";
          const binary = toBuffer(hex);
          const decoded = codec.decode(binary);
          expect(decoded).to.equals(1);
        });
      });
      suite("when given -int32 binary", function () {
        test("should returns -int32 value", async function () {
          const hex = "0dffffffff";
          const binary = toBuffer(hex);
          const decoded = codec.decode(binary);
          expect(decoded).to.equals(-1);
        });
      });
      suite("when given int32 binary", function () {
        test("should returns int32 value", async function () {
          const hex = "0e00000001";
          const binary = toBuffer(hex);
          const decoded = codec.decode(binary);
          expect(decoded).to.equals(1);
        });
      });
      suite("when given uint32 binary", function () {
        test("should returns uint32 value", async function () {
          const hex = "0f00000001";
          const binary = toBuffer(hex);
          const decoded = codec.decode(binary);
          expect(decoded).to.equals(1);
        });
      });
      suite("when given -int64 binary", function () {
        test("should returns -int64 value", async function () {
          const hex = "10ffffffffffffffff";
          const binary = toBuffer(hex);
          const decoded = codec.decode(binary);
          expect(decoded).to.equals(-1n);
        });
      });
      suite("when given int64 binary", function () {
        test("should returns int64 value", async function () {
          const hex = "110000000000000001";
          const binary = toBuffer(hex);
          const decoded = codec.decode(binary);
          expect(decoded).to.equals(1n);
        });
      });
      suite("when given uint64 binary", function () {
        test("should returns uint64 value", async function () {
          const hex = "120000000000000001";
          const binary = toBuffer(hex);
          const decoded = codec.decode(binary);
          expect(decoded).to.equals(1n);
        });
      });
      suite("when given -bigint binary", function () {
        test("should returns -bigint value", async function () {
          const hex = "10ffffffffffffffff";
          const binary = toBuffer(hex);
          const decoded = codec.decode(binary);
          expect(decoded).to.equals(-1n);
        });
      });
      suite("when given bigint binary", function () {
        test("should returns bigint value", async function () {
          const hex = "110000000000000001";
          const binary = toBuffer(hex);
          const decoded = codec.decode(binary);
          expect(decoded).to.equals(1n);
        });
      });
    });

    suite("#encode(binaries, meta)", function () {
      suite("when given -int8 value", function () {
        test("should returns -int8 binary", async function () {
          const value = new IntegerValue(-1, "int8");
          const meta = toValue(value);
          const encoded = codec.encode([], meta) as Buffer[];
          expect(encoded).to.have.lengthOf(2);

          const encodedHex = "07ff";
          const encodedBinary = toBuffer(encodedHex);
          expect(Buffer.concat(encoded)).to.deep.equals(encodedBinary);
        });
      });
      suite("when given int8 value", function () {
        test("should returns int8 binary", async function () {
          const value = new IntegerValue(1, "int8");
          const meta = toValue(value);
          const encoded = codec.encode([], meta) as Buffer[];
          expect(encoded).to.have.lengthOf(2);

          const encodedHex = "0801";
          const encodedBinary = toBuffer(encodedHex);
          expect(Buffer.concat(encoded)).to.deep.equals(encodedBinary);
        });
      });
      suite("when given uint8 value", function () {
        test("should returns uint8 binary", async function () {
          const value = new IntegerValue(1, "uint8");
          const meta = toValue(value);
          const encoded = codec.encode([], meta) as Buffer[];
          expect(encoded).to.have.lengthOf(2);

          const encodedHex = "0901";
          const encodedBinary = toBuffer(encodedHex);
          expect(Buffer.concat(encoded)).to.deep.equals(encodedBinary);
        });
      });
      suite("when given -int16 value", function () {
        test("should returns -int16 binary", async function () {
          const value = new IntegerValue(-1, "int16");
          const meta = toValue(value);
          const encoded = codec.encode([], meta) as Buffer[];
          expect(encoded).to.have.lengthOf(2);

          const encodedHex = "0affff";
          const encodedBinary = toBuffer(encodedHex);
          expect(Buffer.concat(encoded)).to.deep.equals(encodedBinary);
        });
      });
      suite("when given int16 value", function () {
        test("should returns int16 binary", async function () {
          const value = new IntegerValue(1, "int16");
          const meta = toValue(value);
          const encoded = codec.encode([], meta) as Buffer[];
          expect(encoded).to.have.lengthOf(2);

          const encodedHex = "0b0001";
          const encodedBinary = toBuffer(encodedHex);
          expect(Buffer.concat(encoded)).to.deep.equals(encodedBinary);
        });
      });
      suite("when given uint16 value", function () {
        test("should returns uint16 binary", async function () {
          const value = new IntegerValue(1, "uint16");
          const meta = toValue(value);
          const encoded = codec.encode([], meta) as Buffer[];
          expect(encoded).to.have.lengthOf(2);

          const encodedHex = "0c0001";
          const encodedBinary = toBuffer(encodedHex);
          expect(Buffer.concat(encoded)).to.deep.equals(encodedBinary);
        });
      });
      suite("when given -int32 value", function () {
        test("should returns -int32 binary", async function () {
          const value = new IntegerValue(-1, "int32");
          const meta = toValue(value);
          const encoded = codec.encode([], meta) as Buffer[];
          expect(encoded).to.have.lengthOf(2);

          const encodedHex = "0dffffffff";
          const encodedBinary = toBuffer(encodedHex);
          expect(Buffer.concat(encoded)).to.deep.equals(encodedBinary);
        });
      });
      suite("when given int32 value", function () {
        test("should returns int32 binary", async function () {
          const value = new IntegerValue(1, "int32");
          const meta = toValue(value);
          const encoded = codec.encode([], meta) as Buffer[];
          expect(encoded).to.have.lengthOf(2);

          const encodedHex = "0e00000001";
          const encodedBinary = toBuffer(encodedHex);
          expect(Buffer.concat(encoded)).to.deep.equals(encodedBinary);
        });
      });
      suite("when given uint32 value", function () {
        test("should returns uint32 binary", async function () {
          const value = new IntegerValue(1, "uint32");
          const meta = toValue(value);
          const encoded = codec.encode([], meta) as Buffer[];
          expect(encoded).to.have.lengthOf(2);

          const encodedHex = "0f00000001";
          const encodedBinary = toBuffer(encodedHex);
          expect(Buffer.concat(encoded)).to.deep.equals(encodedBinary);
        });
      });
      suite("when given -int64 value", function () {
        test("should returns -int64 binary", async function () {
          const value = new IntegerValue(-1n, "int64");
          const meta = toValue(value);
          const encoded = codec.encode([], meta) as Buffer[];
          expect(encoded).to.have.lengthOf(2);

          const encodedHex = "10ffffffffffffffff";
          const encodedBinary = toBuffer(encodedHex);
          expect(Buffer.concat(encoded)).to.deep.equals(encodedBinary);
        });
      });
      suite("when given int64 value", function () {
        test("should returns int64 binary", async function () {
          const value = new IntegerValue(1n, "int64");
          const meta = toValue(value);
          const encoded = codec.encode([], meta) as Buffer[];
          expect(encoded).to.have.lengthOf(2);

          const encodedHex = "110000000000000001";
          const encodedBinary = toBuffer(encodedHex);
          expect(Buffer.concat(encoded)).to.deep.equals(encodedBinary);
        });
      });
      suite("when given uint64 value", function () {
        test("should returns uint64 binary", async function () {
          const value = new IntegerValue(1n, "uint64");
          const meta = toValue(value);
          const encoded = codec.encode([], meta) as Buffer[];
          expect(encoded).to.have.lengthOf(2);

          const encodedHex = "120000000000000001";
          const encodedBinary = toBuffer(encodedHex);
          expect(Buffer.concat(encoded)).to.deep.equals(encodedBinary);
        });
      });
      suite("when given -bigint value", function () {
        test("should returns -bigint binary", async function () {
          const value = -1n;
          const meta = toValue(value);
          const encoded = codec.encode([], meta) as Buffer[];
          expect(encoded).to.have.lengthOf(2);

          const encodedHex = "10ffffffffffffffff";
          const encodedBinary = toBuffer(encodedHex);
          expect(Buffer.concat(encoded)).to.deep.equals(encodedBinary);
        });
      });
      suite("when given bigint value", function () {
        test("should returns bigint binary", async function () {
          const value = 1n;
          const meta = toValue(value);
          const encoded = codec.encode([], meta) as Buffer[];
          expect(encoded).to.have.lengthOf(2);

          const encodedHex = "110000000000000001";
          const encodedBinary = toBuffer(encodedHex);
          expect(Buffer.concat(encoded)).to.deep.equals(encodedBinary);
        });
      });
    });
  });
});
