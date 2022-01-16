import { encode } from "@marubase/collator";
import { ReadBucket } from "./read-bucket.js";

export class WriteBucket extends ReadBucket {
  public clear(key: unknown): void {
    const encodedKey = encode(key);
    const fdbKey = !Buffer.isBuffer(encodedKey)
      ? encodedKey.buffer
      : encodedKey;
    this._fdbTransaction.clear(fdbKey);
  }

  public clearRange(start: unknown, end: unknown): void {
    const encodedStart = encode(start);
    const fdbStart = !Buffer.isBuffer(encodedStart)
      ? encodedStart.buffer
      : encodedStart;

    const encodedEnd = encode(end);
    const fdbEnd = !Buffer.isBuffer(encodedEnd)
      ? encodedEnd.buffer
      : encodedEnd;
    this._fdbTransaction.clearRange(fdbStart, fdbEnd);
  }

  public set(key: unknown, value: unknown): void {
    const fdbKey = encode(key);
    const fdbValue = encode(value);
    if (!Buffer.isBuffer(fdbKey) && !Buffer.isBuffer(fdbValue)) {
      throw new Error("key and value cannot be versionstamp");
    }
    if (!Buffer.isBuffer(fdbKey)) {
      const { buffer, position } = fdbKey;
      const { prefix } = this._fdbTransaction.subspace;
      const rawKey = Buffer.alloc(prefix.length + buffer.length + 4);
      prefix.copy(rawKey);
      buffer.copy(rawKey, prefix.length);
      rawKey.writeUInt16LE(position + prefix.length, rawKey.length - 4);
      return this._fdbTransaction.setVersionstampedKeyRaw(
        rawKey,
        fdbValue as Buffer,
      );
    }
    if (!Buffer.isBuffer(fdbValue)) {
      const { buffer, position } = fdbValue;
      const rawValue = Buffer.alloc(buffer.length + 4);
      buffer.copy(rawValue);
      rawValue.writeUInt16LE(position, rawValue.length - 4);
      return this._fdbTransaction.setVersionstampedValueRaw(fdbKey, rawValue);
    }
    this._fdbTransaction.set(fdbKey, fdbValue);
  }
}
