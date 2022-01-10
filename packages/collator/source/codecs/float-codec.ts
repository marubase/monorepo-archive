import { FloatValue } from "../values/float-value.js";
import { MetaValue } from "../values/meta-value.js";
import { BaseCodec } from "./base-codec.js";
import { ComplexCodec, EncodeBuffer } from "./complex-codec.js";

export class FloatCodec extends BaseCodec {
  public static service(complex: ComplexCodec): void {
    const instance = new FloatCodec(complex.table);
    complex.registerType("float", instance);
    complex.registerType("number", instance);

    const { ANFLOAT32, APFLOAT32, DNFLOAT32, DPFLOAT32 } = complex.table;
    [ANFLOAT32, APFLOAT32, DNFLOAT32, DPFLOAT32].forEach((code) =>
      complex.registerHandler(code[0], (context, binary) => {
        const { cursor, index, key } = context;
        const { buffer, byteOffset } = binary;
        const encodedOffset = byteOffset + index;
        const encoded = Buffer.from(buffer, encodedOffset, 5);
        const decoded = instance.decode(encoded);
        if (Array.isArray(cursor)) cursor.push(decoded);
        else (cursor as Record<string, unknown>)[key.value] = decoded;
        context.index += 4;
      }),
    );

    const { ANFLOAT64, APFLOAT64, DNFLOAT64, DPFLOAT64 } = complex.table;
    [ANFLOAT64, APFLOAT64, DNFLOAT64, DPFLOAT64].forEach((code) =>
      complex.registerHandler(code[0], (context, binary) => {
        const { cursor, index, key } = context;
        const { buffer, byteOffset } = binary;
        const encodedOffset = byteOffset + index;
        const encoded = Buffer.from(buffer, encodedOffset, 9);
        const decoded = instance.decode(encoded);
        if (Array.isArray(cursor)) cursor.push(decoded);
        else (cursor as Record<string, unknown>)[key.value] = decoded;
        context.index += 8;
      }),
    );
  }

  public decode(binary: Buffer): unknown {
    if (binary[0] < 128) {
      const { ANFLOAT32, APFLOAT32, ANFLOAT64 } = this.table;
      if (ANFLOAT32[0] === binary[0]) {
        const { buffer, byteLength, byteOffset } = binary;
        const inverted = Buffer.from(buffer, byteOffset + 1, byteLength - 1);
        const content = this.invert(inverted);
        return -1 * content.readFloatBE();
      } else if (APFLOAT32[0] === binary[0]) {
        const { buffer, byteLength, byteOffset } = binary;
        const content = Buffer.from(buffer, byteOffset + 1, byteLength - 1);
        return content.readFloatBE();
      } else if (ANFLOAT64[0] === binary[0]) {
        const { buffer, byteLength, byteOffset } = binary;
        const inverted = Buffer.from(buffer, byteOffset + 1, byteLength - 1);
        const content = this.invert(inverted);
        return -1 * content.readDoubleBE();
      } else {
        const { buffer, byteLength, byteOffset } = binary;
        const content = Buffer.from(buffer, byteOffset + 1, byteLength - 1);
        return content.readDoubleBE();
      }
    } else {
      const { DNFLOAT32, DPFLOAT32, DNFLOAT64 } = this.table;
      if (DNFLOAT32[0] === binary[0]) {
        const { buffer, byteLength, byteOffset } = binary;
        const content = Buffer.from(buffer, byteOffset + 1, byteLength - 1);
        return -1 * content.readFloatBE();
      } else if (DPFLOAT32[0] === binary[0]) {
        const { buffer, byteLength, byteOffset } = binary;
        const inverted = Buffer.from(buffer, byteOffset + 1, byteLength - 1);
        const content = this.invert(inverted);
        return content.readFloatBE();
      } else if (DNFLOAT64[0] === binary[0]) {
        const { buffer, byteLength, byteOffset } = binary;
        const content = Buffer.from(buffer, byteOffset + 1, byteLength - 1);
        return -1 * content.readDoubleBE();
      } else {
        const { buffer, byteLength, byteOffset } = binary;
        const inverted = Buffer.from(buffer, byteOffset + 1, byteLength - 1);
        const content = this.invert(inverted);
        return content.readDoubleBE();
      }
    }
  }

  public encode(binaries: EncodeBuffer[], meta: MetaValue): EncodeBuffer[] {
    const float = FloatValue.create(meta.value, "float64");
    if (meta.ascending) {
      if (float.type === "float32") {
        if (float.value >= 0) {
          const { APFLOAT32 } = this.table;
          const content = this.toFloat32(float.value);
          binaries.push(APFLOAT32, content);
          return binaries;
        } else {
          const { ANFLOAT32 } = this.table;
          const content = this.toFloat32(-1 * float.value);
          const inverted = this.invert(content);
          binaries.push(ANFLOAT32, inverted);
          return binaries;
        }
      } else {
        if (float.value >= 0) {
          const { APFLOAT64 } = this.table;
          const content = this.toFloat64(float.value);
          binaries.push(APFLOAT64, content);
          return binaries;
        } else {
          const { ANFLOAT64 } = this.table;
          const content = this.toFloat64(-1 * float.value);
          const inverted = this.invert(content);
          binaries.push(ANFLOAT64, inverted);
          return binaries;
        }
      }
    } else {
      if (float.type === "float32") {
        if (float.value >= 0) {
          const { DPFLOAT32 } = this.table;
          const content = this.toFloat32(float.value);
          const inverted = this.invert(content);
          binaries.push(DPFLOAT32, inverted);
          return binaries;
        } else {
          const { DNFLOAT32 } = this.table;
          const content = this.toFloat32(-1 * float.value);
          binaries.push(DNFLOAT32, content);
          return binaries;
        }
      } else {
        if (float.value >= 0) {
          const { DPFLOAT64 } = this.table;
          const content = this.toFloat64(float.value);
          const inverted = this.invert(content);
          binaries.push(DPFLOAT64, inverted);
          return binaries;
        } else {
          const { DNFLOAT64 } = this.table;
          const content = this.toFloat64(-1 * float.value);
          binaries.push(DNFLOAT64, content);
          return binaries;
        }
      }
    }
  }
}
