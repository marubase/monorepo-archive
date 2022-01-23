/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { decode, encode } from "@marubase/collator";
import {
  RangeOptions,
  StorageError,
  StorageFactory,
  WriteBucketContract,
  WriteTransactionContract,
} from "@marubase/storage";
import { Database, RangeOptions as LMDBRangeOptions } from "lmdb";

export class WriteBucket<Key, Value>
  implements WriteBucketContract<Key, Value>
{
  public readonly factory: StorageFactory;

  public readonly name: string;

  public readonly transaction: WriteTransactionContract;

  protected _lmdbDatabase: Database<Buffer, Buffer>;

  public constructor(
    factory: StorageFactory,
    transaction: WriteTransactionContract,
    name: string,
    lmdbDatabase: Database<Buffer, Buffer>,
  ) {
    this.factory = factory;
    this.transaction = transaction;
    this.name = name;
    this._lmdbDatabase = lmdbDatabase;
  }

  public clear(key: Key): void {
    const encodedKey = encode([this.name, key]);
    const lmdbKey = !Buffer.isBuffer(encodedKey)
      ? encodedKey.buffer
      : encodedKey;
    this._lmdbDatabase.remove(lmdbKey);
  }

  public clearRange(start: Key, end: Key): void {
    const lmdbOptions: LMDBRangeOptions = {};
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

  public async get(key: Key, defaultValue?: Value): Promise<Value | undefined> {
    const encodedKey = encode([this.name, key]);
    const lmdbKey = !Buffer.isBuffer(encodedKey)
      ? encodedKey.buffer
      : encodedKey;
    const lmdbValue = this._lmdbDatabase.getBinary(lmdbKey);
    return typeof lmdbValue !== "undefined"
      ? (decode(lmdbValue) as Value)
      : defaultValue;
  }

  public getRange(
    start: Key,
    end: Key,
    options?: RangeOptions,
  ): AsyncIterable<[Key, Value]> {
    const lmdbOptions = Object.assign({}, options) as LMDBRangeOptions;
    if (typeof lmdbOptions.limit !== "number") lmdbOptions.limit = Infinity;
    if (typeof lmdbOptions.reverse !== "boolean") lmdbOptions.reverse = false;

    const encodedStart = encode([this.name, start]);
    lmdbOptions.start = !Buffer.isBuffer(encodedStart)
      ? encodedStart.buffer
      : encodedStart;

    const encodedEnd = encode([this.name, end]);
    lmdbOptions.end = !Buffer.isBuffer(encodedEnd)
      ? encodedEnd.buffer
      : encodedEnd;

    const lmdbRange = this._lmdbDatabase.getRange(lmdbOptions);
    return this.factory.createRangeIterable(lmdbRange);
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
      lmdbKey.set(this.transaction.commitIDSync!(), position);
      const lmdbValue = encodedValue as Buffer;
      this._lmdbDatabase.put(lmdbKey, lmdbValue);
    } else if (!Buffer.isBuffer(encodedValue)) {
      const { buffer: lmdbValue, position } = encodedValue;
      lmdbValue.set(this.transaction.commitIDSync!(), position);
      const lmdbKey = encodedKey as Buffer;
      this._lmdbDatabase.put(lmdbKey, lmdbValue);
    } else {
      this._lmdbDatabase.put(encodedKey, encodedValue);
    }
  }
}
