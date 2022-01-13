import { expect } from "chai";
import { CodeTable } from "./code-table.js";
import { BooleanCodec } from "./codecs/boolean-codec.js";
import { BufferCodec } from "./codecs/buffer-codec.js";
import { ComplexCodec } from "./codecs/complex-codec.js";
import { DateCodec } from "./codecs/date-codec.js";
import { FloatCodec } from "./codecs/float-codec.js";
import { IntegerCodec } from "./codecs/integer-codec.js";
import { StringCodec } from "./codecs/string-codec.js";
import { VersionCodec } from "./codecs/version-codec.js";
import { Collator } from "./collator.js";
import { FloatValue } from "./values/float-value.js";
import { IntegerValue } from "./values/integer-value.js";
import { VersionstampValue } from "./values/versionstamp-value.js";

suite("Collator", function () {
  let collator: Collator;
  setup(async function () {
    const codec = new ComplexCodec(CodeTable);
    codec.register(BooleanCodec.service);
    codec.register(IntegerCodec.service);
    codec.register(FloatCodec.service);
    codec.register(DateCodec.service);
    codec.register(BufferCodec.service);
    codec.register(StringCodec.service);
    codec.register(VersionCodec.service);

    collator = new Collator(codec);
  });

  suite("#asc(value)", function () {
    test("should returns meta value", async function () {
      const value = false;
      const meta = collator.asc(value);
      expect(meta.type).to.equals("boolean");
      expect(meta.value).to.be.false;
      expect(meta.ascending).to.be.true;
    });
  });

  suite("#decode(binary)", function () {
    test("should returns key value", async function () {
      const binary = Buffer.from([28, 5, 1]);
      const decoded = collator.decode(binary);
      expect(decoded).to.deep.equals([false]);
    });
  });

  suite("#desc(value)", function () {
    test("should returns meta value", async function () {
      const value = false;
      const meta = collator.desc(value);
      expect(meta.type).to.equals("boolean");
      expect(meta.value).to.be.false;
      expect(meta.ascending).to.be.false;
    });
  });

  suite("#encode(value)", function () {
    suite("when encode primitive value", function () {
      test("should returns key value", async function () {
        const value = [false];
        const encoded = collator.encode(collator.asc(value));
        expect(encoded).to.deep.equals(Buffer.from([28, 5, 1]));
      });
    });
    suite("when encode value with versionstamp", function () {
      test("should returns versionstamp value", async function () {
        const value = collator.versionstamp(127);
        const encoded = collator.encode(value);

        const expectedEncoded = {
          buffer: Buffer.from("1900000000000000000000007f", "hex"),
          position: 1,
        };
        expect(encoded).to.deep.equals(expectedEncoded);
      });
    });
    suite("when encode value with multiple versionstamp", function () {
      test("should throws error", async function () {
        const value = [collator.versionstamp(), collator.versionstamp()];
        expect(function () {
          collator.encode(value);
        }).to.throws();
      });
    });
  });

  suite("#float32(value)", function () {
    test("should returns integer value", async function () {
      const integer = collator.float32(1);
      expect(integer).to.be.an.instanceOf(FloatValue);
    });
  });

  suite("#float64(value)", function () {
    test("should returns integer value", async function () {
      const integer = collator.float64(1);
      expect(integer).to.be.an.instanceOf(FloatValue);
    });
  });

  suite("#int8(value)", function () {
    test("should returns integer value", async function () {
      const integer = collator.int8(1);
      expect(integer).to.be.an.instanceOf(IntegerValue);
    });
  });

  suite("#int16(value)", function () {
    test("should returns integer value", async function () {
      const integer = collator.int16(1);
      expect(integer).to.be.an.instanceOf(IntegerValue);
    });
  });

  suite("#int32(value)", function () {
    test("should returns integer value", async function () {
      const integer = collator.int32(1);
      expect(integer).to.be.an.instanceOf(IntegerValue);
    });
  });

  suite("#int64(value)", function () {
    test("should returns integer value", async function () {
      const integer = collator.int64(1n);
      expect(integer).to.be.an.instanceOf(IntegerValue);
    });
  });

  suite("#uint8(value)", function () {
    test("should returns integer value", async function () {
      const integer = collator.uint8(1);
      expect(integer).to.be.an.instanceOf(IntegerValue);
    });
  });

  suite("#uint16(value)", function () {
    test("should returns integer value", async function () {
      const integer = collator.uint16(1);
      expect(integer).to.be.an.instanceOf(IntegerValue);
    });
  });

  suite("#uint32(value)", function () {
    test("should returns integer value", async function () {
      const integer = collator.uint32(1);
      expect(integer).to.be.an.instanceOf(IntegerValue);
    });
  });

  suite("#uint64(value)", function () {
    test("should returns integer value", async function () {
      const integer = collator.uint64(1n);
      expect(integer).to.be.an.instanceOf(IntegerValue);
    });
  });

  suite("#versionstamp(code)", function () {
    suite("when no code is given", function () {
      test("should returns versionstamp with code '0'", async function () {
        const versionstamp = collator.versionstamp();
        expect(versionstamp).to.be.an.instanceOf(VersionstampValue);
        expect(versionstamp.code).to.equals(0);
      });
    });
    suite("when code '127' is given", function () {
      test("should returns versionstamp with code '127'", async function () {
        const versionstamp = collator.versionstamp(127);
        expect(versionstamp).to.be.an.instanceOf(VersionstampValue);
        expect(versionstamp.code).to.equals(127);
      });
    });
    suite("when code Buffer is given", function () {
      test("should returns versionstamp with code '127'", async function () {
        const buffer = Buffer.from("00010203040506070809007f", "hex");
        const versionstamp = collator.versionstamp(buffer);
        expect(versionstamp).to.be.an.instanceOf(VersionstampValue);
        expect(versionstamp.code).to.equals(127);
      });
    });
  });
});
