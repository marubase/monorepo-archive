import { MetaValue } from "../values/meta-value.js";
import { BaseCodec } from "./base-codec.js";
import { ComplexCodec, EncodeBuffer } from "./complex-codec.js";

export class BufferCodec extends BaseCodec {
  public static service(complex: ComplexCodec): void {
    const instance = new BufferCodec(complex.table);
    complex.registerType("buffer", instance);

    const { ABSTART, ABEND, AESCAPE, DBSTART, DBEND, DESCAPE } = complex.table;
    [ABSTART, DBSTART].forEach((code) =>
      complex.registerHandler(code[0], (context, binary) => {
        const { cursor, index: initial, key } = context;
        const { buffer, byteLength, byteOffset } = binary;
        for (; context.index < byteLength; context.index++) {
          const { index } = context;
          if (ABEND[0] === binary[index] || DBEND[0] === binary[index]) {
            const next = index + 1;
            if (
              (ABEND[0] === binary[index] && AESCAPE[0] === binary[next]) ||
              (DBEND[0] === binary[index] && DESCAPE[0] === binary[next])
            ) {
              context.index += 1;
              continue;
            }

            const encodedOffset = byteOffset + initial;
            const encodedLength = index - initial + 1;
            const encoded = Buffer.from(buffer, encodedOffset, encodedLength);
            const decoded = instance.decode(encoded);
            if (Array.isArray(cursor)) cursor.push(decoded);
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
      return content;
    } else {
      const { buffer, byteLength, byteOffset } = binary;
      const inverted = Buffer.from(buffer, byteOffset + 1, byteLength - 2);
      const escaped = this.invert(inverted);
      const content = this.unescape(escaped);
      return content;
    }
  }

  public encode(binaries: EncodeBuffer[], meta: MetaValue): EncodeBuffer[] {
    if (meta.ascending) {
      const { ABSTART, ABEND } = this.table;
      const content = meta.value as Buffer;
      const escaped = this.escape(content);
      binaries.push(ABSTART, escaped, ABEND);
      return binaries;
    } else {
      const { DBSTART, DBEND } = this.table;
      const content = meta.value as Buffer;
      const escaped = this.escape(content);
      const inverted = this.invert(escaped);
      binaries.push(DBSTART, inverted, DBEND);
      return binaries;
    }
  }

  protected escape(binary: Buffer): Buffer {
    const { ABEND, AESCAPE, DBEND, DESCAPE } = this.table;
    const { buffer, byteLength, byteOffset } = binary;
    const blocks = [];
    let index = 0;
    let offset = 0;
    for (; index < byteLength; index++) {
      if (ABEND[0] === binary[index]) {
        const blockOffset = byteOffset + offset;
        const blockLength = index - offset + 1;
        const block = Buffer.from(buffer, blockOffset, blockLength);
        blocks.push(block, AESCAPE);
        offset = index + 1;
        continue;
      }
      if (DBEND[0] === binary[index]) {
        const blockOffset = byteOffset + offset;
        const blockLength = index - offset + 1;
        const block = Buffer.from(buffer, blockOffset, blockLength);
        blocks.push(block, DESCAPE);
        offset = index + 1;
        continue;
      }
    }
    const block = Buffer.from(buffer, byteOffset + offset, index - offset);
    blocks.push(block);
    return Buffer.concat(blocks);
  }

  protected unescape(binary: Buffer): Buffer {
    const { ABEND, AESCAPE, DBEND, DESCAPE } = this.table;
    const { buffer, byteLength, byteOffset } = binary;
    const blocks = [];
    let index = 0;
    let offset = 0;
    for (; index < byteLength; index++) {
      if (
        (ABEND[0] === binary[index] && AESCAPE[0] == binary[index + 1]) ||
        (DBEND[0] === binary[index] && DESCAPE[0] == binary[index + 1])
      ) {
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
