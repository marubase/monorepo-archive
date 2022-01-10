import { MetaValue } from "../values/meta-value.js";
import { BaseCodec } from "./base-codec.js";
import { ComplexCodec, EncodeBuffer } from "./complex-codec.js";

export class StringCodec extends BaseCodec {
  public static service(complex: ComplexCodec): void {
    const instance = new StringCodec(complex.table);
    complex.registerType("string", instance);

    const { ASSTART, ASEND, AESCAPE, DSSTART, DSEND, DESCAPE } = complex.table;
    [ASSTART, DSSTART].forEach((code) =>
      complex.registerHandler(code[0], (context, binary) => {
        const { cursor, index: initial, key } = context;
        const { buffer, byteLength, byteOffset } = binary;
        for (; context.index < byteLength; context.index++) {
          const { index } = context;
          if (ASEND[0] === binary[index] || DSEND[0] === binary[index]) {
            const next = index + 1;
            if (
              (ASEND[0] === binary[index] && AESCAPE[0] === binary[next]) ||
              (DSEND[0] === binary[index] && DESCAPE[0] === binary[next])
            ) {
              context.index += 1;
              continue;
            }

            const encodedOffset = byteOffset + initial;
            const encodedLength = index - initial + 1;
            const encoded = Buffer.from(buffer, encodedOffset, encodedLength);
            const decoded = instance.decode(encoded);
            if (Array.isArray(cursor)) cursor.push(decoded);
            else if (key.target) key.value = decoded as string;
            else (cursor as Record<string, unknown>)[key.value] = decoded;
            break;
          }
        }
      }),
    );
  }

  public decode(binary: Buffer): unknown {
    if (binary[0] < 128) {
      const { buffer, byteLength, byteOffset } = binary;
      const escaped = Buffer.from(buffer, byteOffset + 1, byteLength - 2);
      const content = this.unescape(escaped);
      return content.toString("utf8");
    } else {
      const { buffer, byteLength, byteOffset } = binary;
      const inverted = Buffer.from(buffer, byteOffset + 1, byteLength - 2);
      const escaped = this.invert(inverted);
      const content = this.unescape(escaped);
      return content.toString("utf8");
    }
  }

  public encode(binaries: EncodeBuffer[], meta: MetaValue): EncodeBuffer[] {
    if (meta.ascending) {
      const { ASSTART, ASEND } = this.table;
      const content = Buffer.from(meta.value as string, "utf8");
      const escaped = this.escape(content);
      binaries.push(ASSTART, escaped, ASEND);
      return binaries;
    } else {
      const { DSSTART, DSEND } = this.table;
      const content = Buffer.from(meta.value as string, "utf8");
      const escaped = this.escape(content);
      const inverted = this.invert(escaped);
      binaries.push(DSSTART, inverted, DSEND);
      return binaries;
    }
  }

  protected escape(binary: Buffer): Buffer {
    const { ASEND, AESCAPE } = this.table;
    const { buffer, byteLength, byteOffset } = binary;
    const blocks = [];
    let index = 0;
    let offset = 0;
    for (; index < byteLength; index++) {
      if (ASEND[0] === binary[index]) {
        const blockOffset = byteOffset + offset;
        const blockLength = index - offset + 1;
        const block = Buffer.from(buffer, blockOffset, blockLength);
        blocks.push(block, AESCAPE);
        offset = index + 1;
        continue;
      }
    }
    const block = Buffer.from(buffer, byteOffset + offset, index - offset);
    blocks.push(block);
    return Buffer.concat(blocks);
  }

  protected unescape(binary: Buffer): Buffer {
    const { ASEND, AESCAPE } = this.table;
    const { buffer, byteLength, byteOffset } = binary;
    const blocks = [];
    let index = 0;
    let offset = 0;
    for (; index < byteLength; index++) {
      if (ASEND[0] === binary[index] && AESCAPE[0] == binary[index + 1]) {
        const blockOffset = byteOffset + offset;
        const blockLength = index - offset + 1;
        const block = Buffer.from(buffer, blockOffset, blockLength);
        blocks.push(block);
        offset = index + 2;
        index = index + 1;
        continue;
      }
    }
    const blockLength = index - offset;
    const block = Buffer.from(buffer, byteOffset + offset, blockLength);
    blocks.push(block);
    return Buffer.concat(blocks);
  }
}
