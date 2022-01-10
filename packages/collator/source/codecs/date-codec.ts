import { MetaValue } from "../values/meta-value.js";
import { BaseCodec } from "./base-codec.js";
import { ComplexCodec, EncodeBuffer } from "./complex-codec.js";

export class DateCodec extends BaseCodec {
  public static service(complex: ComplexCodec): void {
    const instance = new DateCodec(complex.table);
    complex.registerType("date", instance);

    const { ANDATE, APDATE, DNDATE, DPDATE } = complex.table;
    [ANDATE, APDATE, DNDATE, DPDATE].forEach((code) =>
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
      const { APDATE } = this.table;
      if (APDATE[0] === binary[0]) {
        const { buffer, byteLength, byteOffset } = binary;
        const content = Buffer.from(buffer, byteOffset + 1, byteLength - 1);
        const timestamp = content.readDoubleBE();
        return new Date(timestamp);
      } else {
        const { buffer, byteLength, byteOffset } = binary;
        const inverted = Buffer.from(buffer, byteOffset + 1, byteLength - 1);
        const content = this.invert(inverted);
        const timestamp = -1 * content.readDoubleBE();
        return new Date(timestamp);
      }
    } else {
      const { DPDATE } = this.table;
      if (DPDATE[0] === binary[0]) {
        const { buffer, byteLength, byteOffset } = binary;
        const inverted = Buffer.from(buffer, byteOffset + 1, byteLength - 1);
        const content = this.invert(inverted);
        const timestamp = content.readDoubleBE();
        return new Date(timestamp);
      } else {
        const { buffer, byteLength, byteOffset } = binary;
        const content = Buffer.from(buffer, byteOffset + 1, byteLength - 1);
        const timestamp = -1 * content.readDoubleBE();
        return new Date(timestamp);
      }
    }
  }

  public encode(binaries: EncodeBuffer[], meta: MetaValue): EncodeBuffer[] {
    const timestamp = (meta.value as Date).getTime();
    if (meta.ascending) {
      const { APDATE, ANDATE } = this.table;
      if (timestamp >= 0) {
        const content = this.toFloat64(timestamp);
        binaries.push(APDATE, content);
        return binaries;
      } else {
        const content = this.toFloat64(-1 * timestamp);
        const inverted = this.invert(content);
        binaries.push(ANDATE, inverted);
        return binaries;
      }
    } else {
      const { DPDATE, DNDATE } = this.table;
      if (timestamp >= 0) {
        const content = this.toFloat64(timestamp);
        const inverted = this.invert(content);
        binaries.push(DPDATE, inverted);
        return binaries;
      } else {
        const content = this.toFloat64(-1 * timestamp);
        binaries.push(DNDATE, content);
        return binaries;
      }
    }
  }
}
