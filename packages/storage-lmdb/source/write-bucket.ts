/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { encode } from "@marubase/collator";
import {
  StorageError,
  StorageFactory,
  WriteBucketContract,
  WriteTransactionContract,
} from "@marubase/storage";
import { Database, RangeOptions } from "lmdb";
import { ReadBucket } from "./read-bucket.js";

export class WriteBucket<Key, Value>
  extends ReadBucket<Key, Value>
  implements WriteBucketContract<Key, Value>
{
  public readonly transaction: WriteTransactionContract;

  public constructor(
    factory: StorageFactory,
    transaction: WriteTransactionContract,
    name: string,
    lmdbDatabase: Database<Buffer, Buffer>,
  ) {
    super(factory, transaction, name, lmdbDatabase);
    this.transaction = transaction;
  }

  public clear(key: Key): void {
    const encodedKey = encode([this.name, key]);
    const lmdbKey = !Buffer.isBuffer(encodedKey)
      ? encodedKey.buffer
      : encodedKey;
    this._lmdbDatabase.remove(lmdbKey);
  }

  public clearRange(start: Key, end: Key): void {
    const lmdbOptions: RangeOptions = {};
    const encodedStart = encode([this.name, start]);
    lmdbOptions.start = !Buffer.isBuffer(encodedStart)
      ? encodedStart.buffer
      : encodedStart;

    const encodedEnd = encode([this.name, end]);
    lmdbOptions.end = !Buffer.isBuffer(encodedEnd)
      ? encodedEnd.buffer
      : encodedEnd;
    this._lmdbDatabase
      .getRange(lmdbOptions)
      .forEach(({ key: lmdbKey }) => this._lmdbDatabase.remove(lmdbKey));
  }

  public set(key: Key, value: Value): void {
    const encodedKey = encode([this.name, key]);
    const encodedValue = encode(value);
    if (!Buffer.isBuffer(encodedKey) && !Buffer.isBuffer(encodedValue)) {
      const context = `Inserting key and value entry.`;
      const problem = `Key and value is both versionstamp.`;
      const solution = `Please either use key or value as versionstamp and not both in an entry.`;
      throw new StorageError(`${context} ${problem} ${solution}`);
    }
    if (!Buffer.isBuffer(encodedKey)) {
      const { buffer: lmdbKey, position } = encodedKey;
      lmdbKey.set(this.transaction.commitID!(), position);
      const lmdbValue = encodedValue as Buffer;
      this._lmdbDatabase.put(lmdbKey, lmdbValue);
      return;
    }
    if (!Buffer.isBuffer(encodedValue)) {
      const { buffer: lmdbValue, position } = encodedValue;
      lmdbValue.set(this.transaction.commitID!(), position);
      const lmdbKey = encodedKey as Buffer;
      this._lmdbDatabase.put(lmdbKey, lmdbValue);
      return;
    }
    this._lmdbDatabase.put(encodedKey, encodedValue);
  }
}
