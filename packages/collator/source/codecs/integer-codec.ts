import { IntegerValue } from "../values/integer-value.js";
import { MetaValue } from "../values/meta-value.js";
import { BaseCodec } from "./base-codec.js";
import { ComplexCodec, EncodeBuffer } from "./complex-codec.js";

export class IntegerCodec extends BaseCodec {
  public static service(complex: ComplexCodec): void {
    const instance = new IntegerCodec(complex.table);
    complex.registerType("bigint", instance);
    complex.registerType("integer", instance);

    const { ANINT8, APINT8, AUINT8, DNINT8, DPINT8, DUINT8 } = complex.table;
    [ANINT8, APINT8, AUINT8, DNINT8, DPINT8, DUINT8].forEach((code) =>
      complex.registerHandler(code[0], (context, binary) => {
        const { cursor, index, key } = context;
        const { buffer, byteOffset } = binary;
        const encodedOffset = byteOffset + index;
        const encoded = Buffer.from(buffer, encodedOffset, 2);
        const decoded = instance.decode(encoded);
        if (Array.isArray(cursor)) cursor.push(decoded);
        else (cursor as Record<string, unknown>)[key.value] = decoded;
        context.index += 1;
      }),
    );

    const { ANINT16, APINT16, AUINT16 } = complex.table;
    const { DNINT16, DPINT16, DUINT16 } = complex.table;
    [ANINT16, APINT16, AUINT16, DNINT16, DPINT16, DUINT16].forEach((code) =>
      complex.registerHandler(code[0], (context, binary) => {
        const { cursor, index, key } = context;
        const { buffer, byteOffset } = binary;
        const encodedOffset = byteOffset + index;
        const encoded = Buffer.from(buffer, encodedOffset, 3);
        const decoded = instance.decode(encoded);
        if (Array.isArray(cursor)) cursor.push(decoded);
        else (cursor as Record<string, unknown>)[key.value] = decoded;
        context.index += 2;
      }),
    );

    const { ANINT32, APINT32, AUINT32 } = complex.table;
    const { DNINT32, DPINT32, DUINT32 } = complex.table;
    [ANINT32, APINT32, AUINT32, DNINT32, DPINT32, DUINT32].forEach((code) =>
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

    const { ANINT64, APINT64, AUINT64 } = complex.table;
    const { DNINT64, DPINT64, DUINT64 } = complex.table;
    [ANINT64, APINT64, AUINT64, DNINT64, DPINT64, DUINT64].forEach((code) =>
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
      const { ANINT8, APINT8, AUINT8 } = this.table;
      const { ANINT16, APINT16, AUINT16 } = this.table;
      const { ANINT32, APINT32, AUINT32 } = this.table;
      const { ANINT64, APINT64 } = this.table;
      if (ANINT8[0] === binary[0] || APINT8[0] === binary[0]) {
        const { buffer, byteLength, byteOffset } = binary;
        const content = Buffer.from(buffer, byteOffset + 1, byteLength - 1);
        return content.readInt8();
      } else if (ANINT16[0] === binary[0] || APINT16[0] === binary[0]) {
        const { buffer, byteLength, byteOffset } = binary;
        const content = Buffer.from(buffer, byteOffset + 1, byteLength - 1);
        return content.readInt16BE();
      } else if (ANINT32[0] === binary[0] || APINT32[0] === binary[0]) {
        const { buffer, byteLength, byteOffset } = binary;
        const content = Buffer.from(buffer, byteOffset + 1, byteLength - 1);
        return content.readInt32BE();
      } else if (ANINT64[0] === binary[0] || APINT64[0] === binary[0]) {
        const { buffer, byteLength, byteOffset } = binary;
        const content = Buffer.from(buffer, byteOffset + 1, byteLength - 1);
        return content.readBigInt64BE();
      } else if (AUINT8[0] === binary[0]) {
        const { buffer, byteLength, byteOffset } = binary;
        const content = Buffer.from(buffer, byteOffset + 1, byteLength - 1);
        return content.readUInt8();
      } else if (AUINT16[0] === binary[0]) {
        const { buffer, byteLength, byteOffset } = binary;
        const content = Buffer.from(buffer, byteOffset + 1, byteLength - 1);
        return content.readUInt16BE();
      } else if (AUINT32[0] === binary[0]) {
        const { buffer, byteLength, byteOffset } = binary;
        const content = Buffer.from(buffer, byteOffset + 1, byteLength - 1);
        return content.readUInt32BE();
      } else {
        const { buffer, byteLength, byteOffset } = binary;
        const content = Buffer.from(buffer, byteOffset + 1, byteLength - 1);
        return content.readBigUInt64BE();
      }
    } else {
      const { DNINT8, DPINT8, DUINT8 } = this.table;
      const { DNINT16, DPINT16, DUINT16 } = this.table;
      const { DNINT32, DPINT32, DUINT32 } = this.table;
      const { DNINT64, DPINT64 } = this.table;
      if (DNINT8[0] === binary[0] || DPINT8[0] === binary[0]) {
        const { buffer, byteLength, byteOffset } = binary;
        const inverted = Buffer.from(buffer, byteOffset + 1, byteLength - 1);
        const content = this.invert(inverted);
        return content.readInt8();
      } else if (DNINT16[0] === binary[0] || DPINT16[0] === binary[0]) {
        const { buffer, byteLength, byteOffset } = binary;
        const inverted = Buffer.from(buffer, byteOffset + 1, byteLength - 1);
        const content = this.invert(inverted);
        return content.readInt16BE();
      } else if (DNINT32[0] === binary[0] || DPINT32[0] === binary[0]) {
        const { buffer, byteLength, byteOffset } = binary;
        const inverted = Buffer.from(buffer, byteOffset + 1, byteLength - 1);
        const content = this.invert(inverted);
        return content.readInt32BE();
      } else if (DNINT64[0] === binary[0] || DPINT64[0] === binary[0]) {
        const { buffer, byteLength, byteOffset } = binary;
        const inverted = Buffer.from(buffer, byteOffset + 1, byteLength - 1);
        const content = this.invert(inverted);
        return content.readBigInt64BE();
      } else if (DUINT8[0] === binary[0]) {
        const { buffer, byteLength, byteOffset } = binary;
        const inverted = Buffer.from(buffer, byteOffset + 1, byteLength - 1);
        const content = this.invert(inverted);
        return content.readUInt8();
      } else if (DUINT16[0] === binary[0]) {
        const { buffer, byteLength, byteOffset } = binary;
        const inverted = Buffer.from(buffer, byteOffset + 1, byteLength - 1);
        const content = this.invert(inverted);
        return content.readUInt16BE();
      } else if (DUINT32[0] === binary[0]) {
        const { buffer, byteLength, byteOffset } = binary;
        const inverted = Buffer.from(buffer, byteOffset + 1, byteLength - 1);
        const content = this.invert(inverted);
        return content.readUInt32BE();
      } else {
        const { buffer, byteLength, byteOffset } = binary;
        const inverted = Buffer.from(buffer, byteOffset + 1, byteLength - 1);
        const content = this.invert(inverted);
        return content.readBigUInt64BE();
      }
    }
  }

  public encode(binaries: EncodeBuffer[], meta: MetaValue): EncodeBuffer[] {
    const integer = IntegerValue.create(meta.value, "int64");
    if (meta.ascending) {
      if (integer.type === "int8") {
        if (integer.value >= 0) {
          const { APINT8 } = this.table;
          const content = this.toInt8(integer.value as number);
          binaries.push(APINT8, content);
          return binaries;
        } else {
          const { ANINT8 } = this.table;
          const content = this.toInt8(integer.value as number);
          binaries.push(ANINT8, content);
          return binaries;
        }
      } else if (integer.type === "int16") {
        if (integer.value >= 0) {
          const { APINT16 } = this.table;
          const content = this.toInt16(integer.value as number);
          binaries.push(APINT16, content);
          return binaries;
        } else {
          const { ANINT16 } = this.table;
          const content = this.toInt16(integer.value as number);
          binaries.push(ANINT16, content);
          return binaries;
        }
      } else if (integer.type === "int32") {
        if (integer.value >= 0) {
          const { APINT32 } = this.table;
          const content = this.toInt32(integer.value as number);
          binaries.push(APINT32, content);
          return binaries;
        } else {
          const { ANINT32 } = this.table;
          const content = this.toInt32(integer.value as number);
          binaries.push(ANINT32, content);
          return binaries;
        }
      } else if (integer.type === "int64") {
        if (integer.value >= 0) {
          const { APINT64 } = this.table;
          const content = this.toInt64(integer.value as bigint);
          binaries.push(APINT64, content);
          return binaries;
        } else {
          const { ANINT64 } = this.table;
          const content = this.toInt64(integer.value as bigint);
          binaries.push(ANINT64, content);
          return binaries;
        }
      } else if (integer.type === "uint8") {
        const { AUINT8 } = this.table;
        const content = this.toUint8(integer.value as number);
        binaries.push(AUINT8, content);
        return binaries;
      } else if (integer.type === "uint16") {
        const { AUINT16 } = this.table;
        const content = this.toUint16(integer.value as number);
        binaries.push(AUINT16, content);
        return binaries;
      } else if (integer.type === "uint32") {
        const { AUINT32 } = this.table;
        const content = this.toUint32(integer.value as number);
        binaries.push(AUINT32, content);
        return binaries;
      } else {
        const { AUINT64 } = this.table;
        const content = this.toUint64(integer.value as bigint);
        binaries.push(AUINT64, content);
        return binaries;
      }
    } else {
      if (integer.type === "int8") {
        if (integer.value >= 0) {
          const { DPINT8 } = this.table;
          const content = this.toInt8(integer.value as number);
          const inverted = this.invert(content);
          binaries.push(DPINT8, inverted);
          return binaries;
        } else {
          const { DNINT8 } = this.table;
          const content = this.toInt8(integer.value as number);
          const inverted = this.invert(content);
          binaries.push(DNINT8, inverted);
          return binaries;
        }
      } else if (integer.type === "int16") {
        if (integer.value >= 0) {
          const { DPINT16 } = this.table;
          const content = this.toInt16(integer.value as number);
          const inverted = this.invert(content);
          binaries.push(DPINT16, inverted);
          return binaries;
        } else {
          const { DNINT16 } = this.table;
          const content = this.toInt16(integer.value as number);
          const inverted = this.invert(content);
          binaries.push(DNINT16, inverted);
          return binaries;
        }
      } else if (integer.type === "int32") {
        if (integer.value >= 0) {
          const { DPINT32 } = this.table;
          const content = this.toInt32(integer.value as number);
          const inverted = this.invert(content);
          binaries.push(DPINT32, inverted);
          return binaries;
        } else {
          const { DNINT32 } = this.table;
          const content = this.toInt32(integer.value as number);
          const inverted = this.invert(content);
          binaries.push(DNINT32, inverted);
          return binaries;
        }
      } else if (integer.type === "int64") {
        if (integer.value >= 0) {
          const { DPINT64 } = this.table;
          const content = this.toInt64(integer.value as bigint);
          const inverted = this.invert(content);
          binaries.push(DPINT64, inverted);
          return binaries;
        } else {
          const { DNINT64 } = this.table;
          const content = this.toInt64(integer.value as bigint);
          const inverted = this.invert(content);
          binaries.push(DNINT64, inverted);
          return binaries;
        }
      } else if (integer.type === "uint8") {
        const { DUINT8 } = this.table;
        const content = this.toUint8(integer.value as number);
        const inverted = this.invert(content);
        binaries.push(DUINT8, inverted);
        return binaries;
      } else if (integer.type === "uint16") {
        const { DUINT16 } = this.table;
        const content = this.toUint16(integer.value as number);
        const inverted = this.invert(content);
        binaries.push(DUINT16, inverted);
        return binaries;
      } else if (integer.type === "uint32") {
        const { DUINT32 } = this.table;
        const content = this.toUint32(integer.value as number);
        const inverted = this.invert(content);
        binaries.push(DUINT32, inverted);
        return binaries;
      } else {
        const { DUINT64 } = this.table;
        const content = this.toUint64(integer.value as bigint);
        const inverted = this.invert(content);
        binaries.push(DUINT64, inverted);
        return binaries;
      }
    }
  }
}
