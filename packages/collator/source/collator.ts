import { ComplexCodec } from "./codecs/complex-codec.js";
import { CollatorError } from "./errors/collator.error.js";
import { FloatValue } from "./values/float-value.js";
import { IntegerValue } from "./values/integer-value.js";
import { MetaValue } from "./values/meta-value.js";
import { VersionstampValue } from "./values/versionstamp-value.js";

export class Collator {
  protected codec: ComplexCodec;

  public constructor(codec: ComplexCodec) {
    this.codec = codec;
  }

  public asc(value: unknown): MetaValue {
    return MetaValue.create(value, true);
  }

  public decode(binary: Buffer): unknown {
    return this.codec.decode(binary);
  }

  public desc(value: unknown): MetaValue {
    return MetaValue.create(value, false);
  }

  public encode(value: unknown): Buffer | VersionstampedBuffer {
    const meta = MetaValue.create(value, true);
    const binaries = this.codec.encode([], meta);

    const encoding = { size: 0, versionstamped: false } as {
      position?: number;
      size: number;
      versionstamped: boolean;
    };
    binaries.forEach((binary) => {
      if (Buffer.isBuffer(binary)) return (encoding.size += binary.length);
      if (encoding.versionstamped) {
        const context = `Encoding value.`;
        const problem = `Value have already been versionstamped.`;
        const solution = `Please make sure value only have single versionstamp.`;
        throw new CollatorError(`${context} ${problem} ${solution}`);
      }
      encoding.position = encoding.size;
      encoding.size += binary.buffer.length;
      encoding.versionstamped = true;
    });

    const encoded = Buffer.allocUnsafe(encoding.size);
    for (let index = 0, offset = 0; index < binaries.length; index++) {
      const binary = binaries[index];
      if (Buffer.isBuffer(binary)) {
        encoded.set(binary, offset);
        offset += binary.length;
      } else {
        encoded.set(binary.buffer, offset);
        offset += binary.buffer.length;
      }
    }
    return typeof encoding.position === "number"
      ? { buffer: encoded, position: encoding.position + 1 }
      : encoded;
  }

  public float32(value: unknown): FloatValue {
    return FloatValue.create(value, "float32");
  }

  public float64(value: unknown): FloatValue {
    return FloatValue.create(value, "float64");
  }

  public int16(value: unknown): IntegerValue {
    return IntegerValue.create(value, "int16");
  }

  public int32(value: unknown): IntegerValue {
    return IntegerValue.create(value, "int32");
  }

  public int64(value: unknown): IntegerValue {
    return IntegerValue.create(value, "int64");
  }

  public int8(value: unknown): IntegerValue {
    return IntegerValue.create(value, "int8");
  }

  public uint16(value: unknown): IntegerValue {
    return IntegerValue.create(value, "uint16");
  }

  public uint32(value: unknown): IntegerValue {
    return IntegerValue.create(value, "uint32");
  }

  public uint64(value: unknown): IntegerValue {
    return IntegerValue.create(value, "uint64");
  }

  public uint8(value: unknown): IntegerValue {
    return IntegerValue.create(value, "uint8");
  }

  public versionstamp(
    code: Buffer | number = 0,
    value?: Buffer,
  ): VersionstampValue {
    return Buffer.isBuffer(code)
      ? VersionstampValue.create(code.readUInt16BE(10), code.subarray(0, 10))
      : VersionstampValue.create(code, value);
  }
}

export type VersionstampedBuffer = {
  buffer: Buffer;
  position: number;
};
