import { MetaValue } from "../values/meta-value.js";
import { BaseCodec } from "./base-codec.js";
import { ComplexCodec, EncodeBuffer } from "./complex-codec.js";

export class BooleanCodec extends BaseCodec {
  public static service(complex: ComplexCodec): void {
    const instance = new BooleanCodec(complex.table);
    complex.registerType("boolean", instance);

    const { AFALSE, ATRUE, DFALSE, DTRUE } = complex.table;
    [AFALSE, ATRUE, DFALSE, DTRUE].forEach((code) =>
      complex.registerHandler(code[0], (context, binary) => {
        const { cursor, index, key } = context;
        const { buffer, byteOffset } = binary;
        const encodedOffset = byteOffset + index;
        const encoded = Buffer.from(buffer, encodedOffset, 1);
        const decoded = instance.decode(encoded);
        if (Array.isArray(cursor)) cursor.push(decoded);
        else (cursor as Record<string, unknown>)[key.value] = decoded;
      }),
    );
  }

  public decode(binary: Buffer): unknown {
    const { ATRUE, DTRUE } = this.table;
    return ATRUE[0] === binary[0] || DTRUE[0] === binary[0];
  }

  public encode(binaries: EncodeBuffer[], meta: MetaValue): EncodeBuffer[] {
    if (meta.ascending) {
      const { AFALSE, ATRUE } = this.table;
      if (meta.value) binaries.push(ATRUE);
      else binaries.push(AFALSE);
      return binaries;
    } else {
      const { DFALSE, DTRUE } = this.table;
      if (meta.value) binaries.push(DTRUE);
      else binaries.push(DFALSE);
      return binaries;
    }
  }
}
