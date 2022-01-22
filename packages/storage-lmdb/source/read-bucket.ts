import { decode, encode } from "@marubase/collator";
import {
  RangeOptions,
  ReadBucketContract,
  ReadTransactionContract,
  StorageFactory,
} from "@marubase/storage";
import { Database, RangeOptions as LMDBRangeOptions } from "lmdb";

export class ReadBucket<Key, Value> implements ReadBucketContract<Key, Value> {
  public readonly factory: StorageFactory;

  public readonly name: string;

  public readonly transaction: ReadTransactionContract;

  protected _lmdbDatabase: Database<Buffer, Buffer>;

  public constructor(
    factory: StorageFactory,
    transaction: ReadTransactionContract,
    name: string,
    lmdbDatabase: Database<Buffer, Buffer>,
  ) {
    this.factory = factory;
    this.transaction = transaction;
    this.name = name;
    this._lmdbDatabase = lmdbDatabase;
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
}
