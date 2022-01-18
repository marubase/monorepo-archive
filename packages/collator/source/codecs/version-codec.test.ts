import { expect } from "chai";
import { CodeTable } from "../code-table.js";
import { VersionstampValue } from "../values/versionstamp-value.js";
import { mirrorRun } from "./mirror-run.test.js";
import { VersionCodec } from "./version-codec.js";

mirrorRun(function (ascending, toBuffer, toValue) {
  describe(`VersionCodec (${ascending ? "asc" : "desc"})`, function () {
    let codec: VersionCodec;
    beforeEach(async function () {
      codec = new VersionCodec(CodeTable);
    });

    describe("#decode(binary)", function () {
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
    });

    describe("#encode(binaries, meta)", function () {
      context("when given versionstamp with no value", function () {
        it("should returns versionstamp binary", async function () {
          const value = VersionstampValue.create(127);
          const meta = toValue(value);
          const encoded = codec.encode([], meta) as [
            { buffer: Buffer; type: string },
          ];
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
      context("when given versionstamp with value", function () {
        it("should returns versionstamp binary", async function () {
          const stampBinary = Buffer.from("ffffffffffffffffffff", "hex");
          const value = VersionstampValue.create(128, stampBinary);
          const meta = toValue(value);
          const encoded = codec.encode([], meta);
          expect(encoded).to.have.lengthOf(1);
          expect(encoded[0]).to.be.an.instanceOf(Buffer);

          const prefixHex = "19";
          const prefixBinary = toBuffer(prefixHex);
          const valueBinary = Buffer.from("ffffffffffffffffffff0080", "hex");
          const expectedBinary = Buffer.concat([prefixBinary, valueBinary]);
          expect(encoded[0]).to.deep.equals(expectedBinary);
        });
      });
    });
  });
});
