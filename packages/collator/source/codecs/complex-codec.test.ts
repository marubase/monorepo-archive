import { expect } from "chai";
import { CodeTable } from "../code-table.js";
import { VersionstampValue } from "../values/versionstamp-value.js";
import { BooleanCodec } from "./boolean-codec.js";
import { BufferCodec } from "./buffer-codec.js";
import { ComplexCodec } from "./complex-codec.js";
import { DateCodec } from "./date-codec.js";
import { FloatCodec } from "./float-codec.js";
import { IntegerCodec } from "./integer-codec.js";
import { mirrorRun } from "./mirror-run.test.js";
import { StringCodec } from "./string-codec.js";
import { VersionCodec } from "./version-codec.js";

mirrorRun(function (ascending, toBuffer, toValue) {
  describe(`ComplexCodec (${ascending ? "asc" : "desc"})`, function () {
    let codec: ComplexCodec;
    beforeEach(async function () {
      codec = new ComplexCodec(CodeTable);
      codec.register(BooleanCodec.service);
      codec.register(IntegerCodec.service);
      codec.register(FloatCodec.service);
      codec.register(DateCodec.service);
      codec.register(BufferCodec.service);
      codec.register(StringCodec.service);
      codec.register(VersionCodec.service);
    });

    describe("#decode(binary)", function () {
      context("when given [] binary", function () {
        it("should returns [] value", async function () {
          const hex = "1c01";
          const binary = toBuffer(hex);
          const decoded = codec.decode(binary);

          const decodedValue: unknown[] = [];
          expect(decoded).to.deep.equals(decodedValue);
        });
      });
      context("when given [true] binary", function () {
        it("should returns [true] value", async function () {
          const hex = "1c0601";
          const binary = toBuffer(hex);
          const decoded = codec.decode(binary);

          const decodedValue = [true];
          expect(decoded).to.deep.equals(decodedValue);
        });
      });
      context("when given [false, true] binary", function () {
        it("should returns [false, true] value", async function () {
          const hex = "1c057c0601";
          const binary = toBuffer(hex);
          const decoded = codec.decode(binary);

          const decodedValue = [false, true];
          expect(decoded).to.deep.equals(decodedValue);
        });
      });
      context("when given [[false, true],[false, true]] binary", function () {
        it("should returns [[false, true],[false, true]] value", async function () {
          const hex = "1c1c057c06017c1c057c060101";
          const binary = toBuffer(hex);
          const decoded = codec.decode(binary);

          const decodedValue = [
            [false, true],
            [false, true],
          ];
          expect(decoded).to.deep.equals(decodedValue);
        });
      });
      context("when given {} binary", function () {
        it("should returns {} value", async function () {
          const hex = "1d00";
          const binary = toBuffer(hex);
          const decoded = codec.decode(binary);

          const decodedValue = {};
          expect(decoded).to.deep.equals(decodedValue);
        });
      });
      context("when given {a:false} binary", function () {
        it("should returns {a:false} value", async function () {
          const hex = "1d1b61027d0500";
          const binary = toBuffer(hex);
          const decoded = codec.decode(binary);

          const decodedValue = { a: false };
          expect(decoded).to.deep.equals(decodedValue);
        });
      });
      context("when given {a:false,b:true} binary", function () {
        it("should returns {a:false,b:true} value", async function () {
          const hex = "1d1b61027d057e1b62027d0600";
          const binary = toBuffer(hex);
          const decoded = codec.decode(binary);

          const decodedValue = { a: false, b: true };
          expect(decoded).to.deep.equals(decodedValue);
        });
      });
      context(
        "when given {a:{a:false,b:true},b:{a:false,b:true}} binary",
        function () {
          it("should returns {a:{a:false,b:true},b:{a:false,b:true}} value", async function () {
            const hex =
              "1d1b61027d1d1b61027d057e1b62027d06007e1b62027d1d1b61027d057e1b62027d060000";
            const binary = toBuffer(hex);
            const decoded = codec.decode(binary);

            const decodedValue = {
              a: { a: false, b: true },
              b: { a: false, b: true },
            };
            expect(decoded).to.deep.equals(decodedValue);
          });
        },
      );
      context(
        "when given [{a:false,b:true},{a:false,b:true}] binary",
        function () {
          it("should returns [{a:false,b:true},{a:false,b:true}] value", async function () {
            const hex =
              "1c1d1b61027d057e1b62027d06007c1d1b61027d057e1b62027d060001";
            const binary = toBuffer(hex);
            const decoded = codec.decode(binary);

            const decodedValue = [
              { a: false, b: true },
              { a: false, b: true },
            ];
            expect(decoded).to.deep.equals(decodedValue);
          });
        },
      );
      context("when given {a:[false,true],b:[false,true]} binary", function () {
        it("should returns {a:[false,true],b:[false,true]} value", async function () {
          const hex = "1d1b61027d1c057c06017e1b62027d1c057c060100";
          const binary = toBuffer(hex);
          const decoded = codec.decode(binary);

          const decodedValue = {
            a: [false, true],
            b: [false, true],
          };
          expect(decoded).to.deep.equals(decodedValue);
        });
      });

      context("when given [null] binary", function () {
        it("should returns [null] value", async function () {
          const hex = "1c0401";
          const binary = toBuffer(hex);
          const decoded = codec.decode(binary);
          expect(decoded).to.deep.equals([null]);
        });
      });
      context("when given {a:null} binary", function () {
        it("should returns {a:null} value", async function () {
          const hex = "1d1b61027d0400";
          const binary = toBuffer(hex);
          const decoded = codec.decode(binary);
          expect(decoded).to.deep.equals({ a: null });
        });
      });

      context("when given [undefined] binary", function () {
        it("should returns [undefined] value", async function () {
          const hex = "1c1e01";
          const binary = toBuffer(hex);
          const decoded = codec.decode(binary);
          expect(decoded).to.deep.equals([undefined]);
        });
      });
      context("when given {a:undefined} binary", function () {
        it("should returns {a:undefined} value", async function () {
          const hex = "1d1b61027d1e00";
          const binary = toBuffer(hex);
          const decoded = codec.decode(binary);
          expect(decoded).to.deep.equals({ a: undefined });
        });
      });

      context("when given [int8] binary", function () {
        it("should returns [int8] value", async function () {
          const hex = "1c080101";
          const binary = toBuffer(hex);
          const decoded = codec.decode(binary);
          expect(decoded).to.deep.equals([1]);
        });
      });
      context("when given {a:int8} binary", function () {
        it("should returns {a:int8} value", async function () {
          const hex = "1d1b61027d080100";
          const binary = toBuffer(hex);
          const decoded = codec.decode(binary);
          expect(decoded).to.deep.equals({ a: 1 });
        });
      });

      context("when given [int16] binary", function () {
        it("should returns [int16] value", async function () {
          const hex = "1c0b000101";
          const binary = toBuffer(hex);
          const decoded = codec.decode(binary);
          expect(decoded).to.deep.equals([1]);
        });
      });
      context("when given {a:int16} binary", function () {
        it("should returns {a:int16} value", async function () {
          const hex = "1d1b61027d0b000100";
          const binary = toBuffer(hex);
          const decoded = codec.decode(binary);
          expect(decoded).to.deep.equals({ a: 1 });
        });
      });

      context("when given [int32] binary", function () {
        it("should returns [int32] value", async function () {
          const hex = "1c0e0000000101";
          const binary = toBuffer(hex);
          const decoded = codec.decode(binary);
          expect(decoded).to.deep.equals([1]);
        });
      });
      context("when given {a:int32} binary", function () {
        it("should returns {a:int32} value", async function () {
          const hex = "1d1b61027d0e0000000100";
          const binary = toBuffer(hex);
          const decoded = codec.decode(binary);
          expect(decoded).to.deep.equals({ a: 1 });
        });
      });

      context("when given [int64] binary", function () {
        it("should returns [int64] value", async function () {
          const hex = "1c11000000000000000101";
          const binary = toBuffer(hex);
          const decoded = codec.decode(binary);
          expect(decoded).to.deep.equals([1n]);
        });
      });
      context("when given {a:int64} binary", function () {
        it("should returns {a:int64} value", async function () {
          const hex = "1d1b61027d11000000000000000100";
          const binary = toBuffer(hex);
          const decoded = codec.decode(binary);
          expect(decoded).to.deep.equals({ a: 1n });
        });
      });

      context("when given [float32] binary", function () {
        it("should returns [float32] value", async function () {
          const hex = "1c143f80000001";
          const binary = toBuffer(hex);
          const decoded = codec.decode(binary);
          expect(decoded).to.deep.equals([1]);
        });
      });
      context("when given {a:float32} binary", function () {
        it("should returns {a:float32} value", async function () {
          const hex = "1d1b61027d143f80000000";
          const binary = toBuffer(hex);
          const decoded = codec.decode(binary);
          expect(decoded).to.deep.equals({ a: 1 });
        });
      });

      context("when given [float64] binary", function () {
        it("should returns [float64] value", async function () {
          const hex = "1c163ff000000000000001";
          const binary = toBuffer(hex);
          const decoded = codec.decode(binary);
          expect(decoded).to.deep.equals([1]);
        });
      });
      context("when given {a:float64} binary", function () {
        it("should returns {a:float64} value", async function () {
          const hex = "1d1b61027d163ff000000000000000";
          const binary = toBuffer(hex);
          const decoded = codec.decode(binary);
          expect(decoded).to.deep.equals({ a: 1 });
        });
      });

      context("when given [date] binary", function () {
        it("should returns [date] value", async function () {
          const hex = "1c183ff000000000000001";
          const binary = toBuffer(hex);
          const decoded = codec.decode(binary);
          expect(decoded).to.deep.equals([new Date(1)]);
        });
      });
      context("when given {a:date} binary", function () {
        it("should returns {a:date} value", async function () {
          const hex = "1d1b61027d183ff000000000000000";
          const binary = toBuffer(hex);
          const decoded = codec.decode(binary);
          expect(decoded).to.deep.equals({ a: new Date(1) });
        });
      });

      context("when given [buffer] binary", function () {
        it("should returns [buffer] value", async function () {
          const hex = "1c1a037Ffc800301";
          const binary = toBuffer(hex);
          const decoded = codec.decode(binary);
          expect(decoded).to.deep.equals([Buffer.from([3, 252])]);
        });
      });
      context("when given {a:buffer} binary", function () {
        it("should returns {a:buffer} value", async function () {
          const hex = "1d1b61027d1a037Ffc800300";
          const binary = toBuffer(hex);
          const decoded = codec.decode(binary);
          expect(decoded).to.deep.equals({
            a: Buffer.from([3, 252]),
          });
        });
      });

      context("when given [string] binary", function () {
        it("should returns [string] value", async function () {
          const hex = "1c1b027fc3bd0201";
          const binary = toBuffer(hex);
          const decoded = codec.decode(binary);
          expect(decoded).to.deep.equals(["\x02\xfd"]);
        });
      });
      context("when given {a:string} binary", function () {
        it("should returns {a:string} value", async function () {
          const hex = "1d1b61027d1b027fc3bd0200";
          const binary = toBuffer(hex);
          const decoded = codec.decode(binary);
          expect(decoded).to.deep.equals({ a: "\x02\xfd" });
        });
      });
      context("when given versionstamp binary", function () {
        it("should returns versionstamp value", async function () {
          const prefixHex = "19";
          const prefixBinary = toBuffer(prefixHex);
          const valueBinary = Buffer.from("ffffffffffffffffffff00ff", "hex");
          const binary = Buffer.concat([prefixBinary, valueBinary]);
          const decoded = codec.decode(binary) as VersionstampValue;
          expect(decoded).to.an.instanceOf(VersionstampValue);
          expect(decoded.code).to.equals(255);

          const expectedValue = Buffer.from("ffffffffffffffffffff", "hex");
          expect(decoded.value).to.deep.equals(expectedValue);
        });
      });
      context("when given versionstamp binary as object value", function () {
        it("should returns versionstamp value", async function () {
          const prefixHex = "1d1b61027d19";
          const prefixBinary = toBuffer(prefixHex);
          const suffixHex = "00";
          const suffixBinary = toBuffer(suffixHex);
          const valueBinary = Buffer.from("ffffffffffffffffffff00ff", "hex");
          const binary = Buffer.concat([
            prefixBinary,
            valueBinary,
            suffixBinary,
          ]);
          const decoded = codec.decode(binary) as { a: VersionstampValue };
          expect(decoded.a).to.an.instanceOf(VersionstampValue);
          expect(decoded.a.code).to.equals(255);

          const expectedValue = Buffer.from("ffffffffffffffffffff", "hex");
          expect(decoded.a.value).to.deep.equals(expectedValue);
        });
      });
    });

    describe("#encode(binary, meta)", function () {
      context("when given [] value", function () {
        it("should returns [] binary", async function () {
          const value: unknown[] = [];
          const meta = toValue(value);
          const encoded = codec.encode([], meta) as Buffer[];
          expect(encoded).to.have.lengthOf(2);

          const encodedHex = "1c01";
          const encodedBinary = toBuffer(encodedHex);
          expect(Buffer.concat(encoded)).to.deep.equals(encodedBinary);
        });
      });
      context("when given [false] value", function () {
        it("should returns [false] binary", async function () {
          const value = [false];
          const meta = toValue(value);
          const encoded = codec.encode([], meta) as Buffer[];
          expect(encoded).to.have.lengthOf(3);

          const encodedHex = "1c0501";
          const encodedBinary = toBuffer(encodedHex);
          expect(Buffer.concat(encoded)).to.deep.equals(encodedBinary);
        });
      });
      context("when given [false, true] value", function () {
        it("should returns [false, true] binary", async function () {
          const value = [false, true];
          const meta = toValue(value);
          const encoded = codec.encode([], meta) as Buffer[];
          expect(encoded).to.have.lengthOf(5);

          const encodedHex = "1c057c0601";
          const encodedBinary = toBuffer(encodedHex);
          expect(Buffer.concat(encoded)).to.deep.equals(encodedBinary);
        });
      });
      context("when given [[false, true],[false, true]] value", function () {
        it("should returns [[false, true],[false, true]] binary", async function () {
          const value = [
            [false, true],
            [false, true],
          ];
          const meta = toValue(value);
          const encoded = codec.encode([], meta) as Buffer[];
          expect(encoded).to.have.lengthOf(13);

          const encodedHex = "1c1c057c06017c1c057c060101";
          const encodedBinary = toBuffer(encodedHex);
          expect(Buffer.concat(encoded)).to.deep.equals(encodedBinary);
        });
      });
      context("when given {} value", function () {
        it("should returns {} binary", async function () {
          const value = {};
          const meta = toValue(value);
          const encoded = codec.encode([], meta) as Buffer[];
          expect(encoded).to.have.lengthOf(2);

          const encodedHex = "1d00";
          const encodedBinary = toBuffer(encodedHex);
          expect(Buffer.concat(encoded)).to.deep.equals(encodedBinary);
        });
      });
      context("when given {a:false} value", function () {
        it("should returns {a:false} binary", async function () {
          const value = { a: false };
          const meta = toValue(value);
          const encoded = codec.encode([], meta) as Buffer[];
          expect(encoded).to.have.lengthOf(7);

          const encodedHex = "1d1b61027d0500";
          const encodedBinary = toBuffer(encodedHex);
          expect(Buffer.concat(encoded)).to.deep.equals(encodedBinary);
        });
      });
      context("when given {a:false,b:true} value", function () {
        it("should returns {a:false,b:true} binary", async function () {
          const value = { a: false, b: true };
          const meta = toValue(value);
          const encoded = codec.encode([], meta) as Buffer[];
          expect(encoded).to.have.lengthOf(13);

          const encodedHex = "1d1b61027d057e1b62027d0600";
          const encodedBinary = toBuffer(encodedHex);
          expect(Buffer.concat(encoded)).to.deep.equals(encodedBinary);
        });
      });
      context(
        "when given {a:{a:false,b:true},b:{a:false,b:true}} value",
        function () {
          it("should returns {a:{a:false,b:true},b:{a:false,b:true}} binary", async function () {
            const value = {
              a: { a: false, b: true },
              b: { a: false, b: true },
            };
            const meta = toValue(value);
            const encoded = codec.encode([], meta) as Buffer[];
            expect(encoded).to.have.lengthOf(37);

            const encodedHex =
              "1d1b61027d1d1b61027d057e1b62027d06007e1b62027d1d1b61027d057e1b62027d060000";
            const encodedBinary = toBuffer(encodedHex);
            expect(Buffer.concat(encoded)).to.deep.equals(encodedBinary);
          });
        },
      );
      context(
        "when given [{a:false,b:true},{a:false,b:true}] value",
        function () {
          it("should returns [{a:false,b:true},{a:false,b:true}] binary", async function () {
            const value = [
              { a: false, b: true },
              { a: false, b: true },
            ];
            const meta = toValue(value);
            const encoded = codec.encode([], meta) as Buffer[];
            expect(encoded).to.have.lengthOf(29);

            const encodedHex =
              "1c1d1b61027d057e1b62027d06007c1d1b61027d057e1b62027d060001";
            const encodedBinary = toBuffer(encodedHex);
            expect(Buffer.concat(encoded)).to.deep.equals(encodedBinary);
          });
        },
      );
      context("when given {a:[false,true],b:[false,true]} value", function () {
        it("should returns {a:[false,true],b:[false,true]} binary", async function () {
          const value = {
            a: [false, true],
            b: [false, true],
          };
          const meta = toValue(value);
          const encoded = codec.encode([], meta) as Buffer[];
          expect(encoded).to.have.lengthOf(21);

          const encodedHex = "1d1b61027d1c057c06017e1b62027d1c057c060100";
          const encodedBinary = toBuffer(encodedHex);
          expect(Buffer.concat(encoded)).to.deep.equals(encodedBinary);
        });
      });
      context("when given null value", function () {
        it("should returns null binary", async function () {
          const value = null;
          const meta = toValue(value);
          const encoded = codec.encode([], meta) as Buffer[];
          expect(encoded).to.have.lengthOf(1);

          const encodedHex = "04";
          const encodedBinary = toBuffer(encodedHex);
          expect(Buffer.concat(encoded)).to.deep.equals(encodedBinary);
        });
      });
      context("when given undefined value", function () {
        it("should returns undefined binary", async function () {
          const value = undefined;
          const meta = toValue(value);
          const encoded = codec.encode([], meta) as Buffer[];
          expect(encoded).to.have.lengthOf(1);

          const encodedHex = "1e";
          const encodedBinary = toBuffer(encodedHex);
          expect(Buffer.concat(encoded)).to.deep.equals(encodedBinary);
        });
      });
      context("when given versionstamp value", function () {
        it("should returns versionstamp binary", async function () {
          const value = VersionstampValue.create(127);
          const meta = toValue(value);
          const encoded = codec.encode([], meta) as {
            buffer: Buffer;
            type: string;
          }[];
          expect(encoded).to.have.lengthOf(1);
          expect(encoded[0]).to.be.an("object");
          expect(encoded[0].buffer).to.be.an.instanceOf(Buffer);
          expect(encoded[0].type).to.equals("versionstamp");

          const prefixHex = "19";
          const prefixBinary = toBuffer(prefixHex);
          const valueBinary = Buffer.from("00000000000000000000007f", "hex");
          const expectedBinary = Buffer.concat([prefixBinary, valueBinary]);
          expect(encoded[0].buffer).to.deep.equals(expectedBinary);
        });
      });
    });
  });
});
