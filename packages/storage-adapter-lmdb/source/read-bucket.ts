import { decode, encode } from "@marubase/collator";
import {
  RangeOptions,
  ReadBucketContract,
  StorageFactory,
} from "@marubase/storage-adapter";
import { Database, RangeOptions as LMDBRangeOptions } from "lmdb";

export class ReadBucket implements ReadBucketContract {
  protected _bucketName: string;

  protected _factory: StorageFactory;

  protected _lmdbDatabase: Database<Buffer, Buffer>;

  public constructor(
    lmdbDatabase: Database<Buffer, Buffer>,
    bucketName: string,
    factory: StorageFactory,
  ) {
    this._lmdbDatabase = lmdbDatabase;
    this._bucketName = bucketName;
    this._factory = factory;
  }

  public async get(key: unknown): Promise<unknown> {
    const encodedKey = encode([this._bucketName, key]);
    const lmdbKey = !Buffer.isBuffer(encodedKey)
      ? encodedKey.buffer
      : encodedKey;
    const lmdbValue = this._lmdbDatabase.getBinary(lmdbKey);
    return typeof lmdbValue !== "undefined" ? decode(lmdbValue) : lmdbValue;
  }

  public getRange(
    start: unknown,
    end: unknown,
    options?: RangeOptions,
  ): AsyncIterable<[unknown, unknown]> {
    const lmdbOptions = Object.assign({}, options) as LMDBRangeOptions;
    if (typeof lmdbOptions.limit !== "number") lmdbOptions.limit = Infinity;
    if (typeof lmdbOptions.reverse !== "boolean") lmdbOptions.reverse = false;

    const encodedStart = encode([this._bucketName, start]);
    lmdbOptions.start = !Buffer.isBuffer(encodedStart)
      ? encodedStart.buffer
      : encodedStart;

    const encodedEnd = encode([this._bucketName, end]);
    lmdbOptions.end = !Buffer.isBuffer(encodedEnd)
      ? encodedEnd.buffer
      : encodedEnd;

    const lmdbRange = this._lmdbDatabase.getRange(lmdbOptions);
    return this._factory.createRangeIterable(lmdbRange);
  }
}
