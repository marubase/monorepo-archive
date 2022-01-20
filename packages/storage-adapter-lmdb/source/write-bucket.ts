import { decode, encode } from "@marubase/collator";
import {
  StorageError,
  StorageFactory,
  WriteBucketContract,
} from "@marubase/storage-adapter";
import { Database, RangeOptions } from "lmdb";
import { MutationCounter } from "./mutation-counter.js";
import { ReadBucket } from "./read-bucket.js";

export class WriteBucket extends ReadBucket implements WriteBucketContract {
  protected _mutationCounter: Buffer;

  public constructor(
    lmdbDatabase: Database<Buffer, Buffer>,
    bucketName: string,
    factory: StorageFactory,
  ) {
    super(lmdbDatabase, bucketName, factory);

    const encodedCounterBinary =
      this._lmdbDatabase.get(MutationCounter.key) ||
      Buffer.from("1a0000000000000000000003", "hex");
    const counterBinary = decode(encodedCounterBinary) as Buffer;
    const counter = MutationCounter.toBigInt(counterBinary) + 1n;

    const reCounterBinary = MutationCounter.toBinary(counter);
    const reEncodedCounterBinary = encode(reCounterBinary) as Buffer;
    this._lmdbDatabase.put(MutationCounter.key, reEncodedCounterBinary);
    this._mutationCounter = reCounterBinary;
  }

  public clear(key: unknown): void {
    const encodedKey = encode([this._bucketName, key]);
    const lmdbKey = !Buffer.isBuffer(encodedKey)
      ? encodedKey.buffer
      : encodedKey;
    this._lmdbDatabase.remove(lmdbKey);
  }

  public clearRange(start: unknown, end: unknown): void {
    const lmdbOptions: RangeOptions = {};
    const encodedStart = encode([this._bucketName, start]);
    lmdbOptions.start = !Buffer.isBuffer(encodedStart)
      ? encodedStart.buffer
      : encodedStart;

    const encodedEnd = encode([this._bucketName, end]);
    lmdbOptions.end = !Buffer.isBuffer(encodedEnd)
      ? encodedEnd.buffer
      : encodedEnd;
    this._lmdbDatabase
      .getRange(lmdbOptions)
      .forEach(({ key: lmdbKey }) => this._lmdbDatabase.remove(lmdbKey));
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
      const { buffer: lmdbKey, position } = encodedKey;
      lmdbKey.set(this._mutationCounter, position);
      const lmdbValue = encodedValue as Buffer;
      this._lmdbDatabase.put(lmdbKey, lmdbValue);
      return;
    }
    if (!Buffer.isBuffer(encodedValue)) {
      const { buffer: lmdbValue, position } = encodedValue;
      lmdbValue.set(this._mutationCounter, position);
      const lmdbKey = encodedKey as Buffer;
      this._lmdbDatabase.put(lmdbKey, lmdbValue);
      return;
    }
    this._lmdbDatabase.put(encodedKey, encodedValue);
  }
}
