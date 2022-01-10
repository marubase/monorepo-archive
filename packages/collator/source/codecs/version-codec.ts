import { MetaValue } from "../values/meta-value.js";
import { VersionStamp } from "../values/version-stamp.js";
import { BaseCodec } from "./base-codec.js";
import { ComplexCodec, EncodeBuffer } from "./complex-codec.js";

export class VersionCodec extends BaseCodec {
  public static service(complex: ComplexCodec): void {
    const instance = new VersionCodec(complex.table);
    complex.registerType("versionstamp", instance);

    const { AVERSION, DVERSION } = complex.table;
    [AVERSION, DVERSION].forEach((code) => {
      complex.registerHandler(code[0], (context, binary) => {
        const { cursor, index, key } = context;
        const { buffer, byteOffset } = binary;
        const encodedOffset = byteOffset + index;
        const encoded = Buffer.from(buffer, encodedOffset, 13);
        const decoded = instance.decode(encoded);
        if (Array.isArray(cursor)) cursor.push(decoded);
        else (cursor as Record<string, unknown>)[key.value] = decoded;
        context.index += 12;
      });
    });
  }

  public decode(binary: Buffer): unknown {
    const { buffer, byteOffset } = binary;
    const value = Buffer.from(buffer, byteOffset + 1, 10);
    const code = Buffer.from(buffer, byteOffset + 11, 2).readUInt16BE();
    return VersionStamp.create(code, value);
  }

  public encode(binaries: EncodeBuffer[], meta: MetaValue): EncodeBuffer[] {
    const versionstamp = meta.value as VersionStamp;
    const buffer = Buffer.alloc(13);
    versionstamp.buffer.copy(buffer, 1);
    if (meta.ascending) {
      const { AVERSION } = this.table;
      AVERSION.copy(buffer);
      if (versionstamp.isBounded()) binaries.push(buffer);
      else binaries.push({ buffer, type: "versionstamp" });
      return binaries;
    } else {
      const { DVERSION } = this.table;
      DVERSION.copy(buffer);
      if (versionstamp.isBounded()) binaries.push(buffer);
      else binaries.push({ buffer, type: "versionstamp" });
      return binaries;
    }
  }
}
