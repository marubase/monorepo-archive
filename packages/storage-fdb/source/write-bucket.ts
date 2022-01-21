import { encode } from "@marubase/collator";
import {
  StorageError,
  StorageFactory,
  WriteBucketContract,
  WriteTransactionContract,
} from "@marubase/storage";
import { Transaction } from "foundationdb";
import { ReadBucket } from "./read-bucket.js";

export class WriteBucket extends ReadBucket implements WriteBucketContract {
  protected _transaction: WriteTransactionContract;

  public constructor(
    factory: StorageFactory,
    transaction: WriteTransactionContract,
    name: string,
    fdbTransaction: Transaction,
  ) {
    super(factory, transaction, name, fdbTransaction);
    this._transaction = transaction;
  }

  public get transaction(): WriteTransactionContract {
    return this._transaction;
  }

  public clear(key: unknown): void {
    const encodedKey = encode(key);
    const fdbKey = !Buffer.isBuffer(encodedKey)
      ? encodedKey.buffer
      : encodedKey;
    this._fdbTransaction.clear(fdbKey);
  }

  public clearRange(start: unknown, end: unknown): void {
    const encodedStart = encode(start);
    const encodedEnd = encode(end);
    const fdbStart = !Buffer.isBuffer(encodedStart)
      ? encodedStart.buffer
      : encodedStart;
    const fdbEnd = !Buffer.isBuffer(encodedEnd)
      ? encodedEnd.buffer
      : encodedEnd;
    return this._fdbTransaction.clearRange(fdbStart, fdbEnd);
  }

  public set(key: unknown, value: unknown): void {
    const encodedKey = encode(key);
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
      const fdbKey = Buffer.alloc(prefix.length + buffer.length + 4);
      prefix.copy(fdbKey);
      buffer.copy(fdbKey, prefix.length);
      fdbKey.writeUInt16LE(position + prefix.length, fdbKey.length - 4);
      const fdbValue = encodedValue as Buffer;
      return this._fdbTransaction.setVersionstampedKeyRaw(fdbKey, fdbValue);
    }
    if (!Buffer.isBuffer(encodedValue)) {
      const { buffer, position } = encodedValue;
      const fdbKey = encodedKey as Buffer;
      const fdbValue = Buffer.alloc(buffer.length + 4);
      buffer.copy(fdbValue);
      fdbValue.writeUInt16LE(position, fdbValue.length - 4);
      return this._fdbTransaction.setVersionstampedValueRaw(fdbKey, fdbValue);
    }
    this._fdbTransaction.set(encodedKey, encodedValue);
  }
}
