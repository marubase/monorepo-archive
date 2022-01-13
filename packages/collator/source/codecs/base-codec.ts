import { CodeTable } from "../code-table.js";

export class BaseCodec {
  public constructor(public table: typeof CodeTable) {}

  protected invert(binary: Buffer): Buffer {
    const { buffer, byteLength, byteOffset } = binary.map((b) => b ^ 255);
    return Buffer.from(buffer, byteOffset, byteLength);
  }

  protected toFloat32(value: number): Buffer {
    const binary = Buffer.allocUnsafe(4);
    binary.writeFloatBE(value);
    return binary;
  }

  protected toFloat64(value: number): Buffer {
    const binary = Buffer.allocUnsafe(8);
    binary.writeDoubleBE(value);
    return binary;
  }

  protected toInt16(value: number): Buffer {
    const binary = Buffer.allocUnsafe(2);
    binary.writeInt16BE(value);
    return binary;
  }

  protected toInt32(value: number): Buffer {
    const binary = Buffer.allocUnsafe(4);
    binary.writeInt32BE(value);
    return binary;
  }

  protected toInt64(value: bigint): Buffer {
    const binary = Buffer.allocUnsafe(8);
    binary.writeBigInt64BE(value);
    return binary;
  }

  protected toInt8(value: number): Buffer {
    const binary = Buffer.allocUnsafe(1);
    binary.writeInt8(value);
    return binary;
  }

  protected toUint16(value: number): Buffer {
    const binary = Buffer.allocUnsafe(2);
    binary.writeUInt16BE(value);
    return binary;
  }

  protected toUint32(value: number): Buffer {
    const binary = Buffer.allocUnsafe(4);
    binary.writeUInt32BE(value);
    return binary;
  }

  protected toUint64(value: bigint): Buffer {
    const binary = Buffer.allocUnsafe(8);
    binary.writeBigUInt64BE(value);
    return binary;
  }

  protected toUint8(value: number): Buffer {
    const binary = Buffer.allocUnsafe(1);
    binary.writeUInt8(value);
    return binary;
  }
}
