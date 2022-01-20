import { encode } from "@marubase/collator";
import { StorageError, WriteBucketContract } from "@marubase/storage-adapter";
import { ReadBucket } from "./read-bucket.js";

export class WriteBucket extends ReadBucket implements WriteBucketContract {
  public clear(key: unknown): void {
    const encodedKey = encode([this._bucketName, key]);
    const fdbKey = !Buffer.isBuffer(encodedKey)
      ? encodedKey.buffer
      : encodedKey;
    this._fdbTransaction.clear(fdbKey);
  }

  public clearRange(start: unknown, end: unknown): void {
    const encodedStart = encode([this._bucketName, start]);
    const encodedEnd = encode([this._bucketName, end]);
    const fdbStart = !Buffer.isBuffer(encodedStart)
      ? encodedStart.buffer
      : encodedStart;
    const fdbEnd = !Buffer.isBuffer(encodedEnd)
      ? encodedEnd.buffer
      : encodedEnd;
    return this._fdbTransaction.clearRange(fdbStart, fdbEnd);
  }

  public set(key: unknown, value: unknown): void {
    const encodedKey = encode([this._bucketName, key]);
    const encodedValue = encode(value);
    if (!Buffer.isBuffer(encodedKey) && !Buffer.isBuffer(encodedValue)) {
      const context = `Inserting key and value entry.`;
      const problem = `Key and value is both versionstamp.`;
      const solution = `Please either use key or value as versionstamp and not both in an entry.`;
      throw new StorageError(`${context} ${problem} ${solution}`);
    }
    if (!Buffer.isBuffer(encodedKey)) {
      const { buffer, position } = encodedKey;
      const { prefix } = this._fdbTransaction.subspace;
      const fdbKey = Buffer.allocUnsafe(prefix.length + buffer.length + 4);
      prefix.copy(fdbKey);
      buffer.copy(fdbKey, prefix.length);
      fdbKey.writeUInt16LE(position + prefix.length, fdbKey.length - 4);
      const fdbValue = encodedValue as Buffer;
      return this._fdbTransaction.setVersionstampedKeyRaw(fdbKey, fdbValue);
    }
    if (!Buffer.isBuffer(encodedValue)) {
      const { buffer, position } = encodedValue;
      const fdbKey = encodedKey as Buffer;
      const fdbValue = Buffer.allocUnsafe(buffer.length + 4);
      buffer.copy(fdbValue);
      fdbValue.writeUInt16LE(position, fdbValue.length - 4);
      return this._fdbTransaction.setVersionstampedValueRaw(fdbKey, fdbValue);
    }
    this._fdbTransaction.set(encodedKey, encodedValue);
  }
}