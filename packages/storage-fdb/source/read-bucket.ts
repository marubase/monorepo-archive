import {
  decode,
  encode,
  RangeOptions,
  ReadBucketInterface,
  ReadTransactionInterface,
  StorageFactory,
  Watch,
} from "@marubase/storage";
import { keySelector, Transaction } from "foundationdb";

export class ReadBucket<Key, Value> implements ReadBucketInterface<Key, Value> {
  public readonly factory: StorageFactory;

  public readonly name: string;

  public readonly transaction: ReadTransactionInterface;

  protected _fdbTransaction: Transaction;

  public constructor(
    factory: StorageFactory,
    transaction: ReadTransactionInterface,
    name: string,
    fdbTransaction: Transaction,
  ) {
    this.factory = factory;
    this.transaction = transaction;
    this.name = name;
    this._fdbTransaction = fdbTransaction;
  }

  public async get(key: Key, defaultValue?: Value): Promise<Value | undefined> {
    const fdbValue = await this.getBinary(key);
    return typeof fdbValue !== "undefined"
      ? (decode(fdbValue) as Value)
      : defaultValue;
  }

  public async getBinary(key: Key): Promise<Buffer | undefined> {
    const encodedKey = encode(key);
    const fdbKey = !Buffer.isBuffer(encodedKey)
      ? encodedKey.buffer
      : encodedKey;
    return this._fdbTransaction.get(fdbKey);
  }

  public getRange(
    start: Key,
    end: Key,
    options?: RangeOptions,
  ): AsyncIterable<[Key, Value]> {
    const fdbOptions = Object.assign({}, options) as Required<RangeOptions>;
    if (typeof fdbOptions.limit !== "number") fdbOptions.limit = 1000;
    if (typeof fdbOptions.reverse !== "boolean") fdbOptions.reverse = false;

    const encodedStart = encode(start);
    const encodedEnd = encode(end);
    if (!fdbOptions.reverse) {
      const fdbStart = !Buffer.isBuffer(encodedStart)
        ? encodedStart.buffer
        : encodedStart;
      const fdbEnd = !Buffer.isBuffer(encodedEnd)
        ? encodedEnd.buffer
        : encodedEnd;
      const fdbBatchRange = this._fdbTransaction.getRangeBatch(
        fdbStart,
        fdbEnd,
        fdbOptions,
      );
      return this.factory.createRangeIterable<Key, Value>(fdbBatchRange);
    } else {
      const fdbStart = !Buffer.isBuffer(encodedEnd)
        ? keySelector.firstGreaterThan(encodedEnd.buffer)
        : keySelector.firstGreaterThan(encodedEnd);
      const fdbEnd = !Buffer.isBuffer(encodedStart)
        ? keySelector.firstGreaterThan(encodedStart.buffer)
        : keySelector.firstGreaterThan(encodedStart);
      const fdbBatchRange = this._fdbTransaction.getRangeBatch(
        fdbStart,
        fdbEnd,
        fdbOptions,
      );
      return this.factory.createRangeIterable<Key, Value>(fdbBatchRange);
    }
  }

  public watch(key: Key): Watch {
    const encodedKey = encode(key);
    const fdbKey = !Buffer.isBuffer(encodedKey)
      ? encodedKey.buffer
      : encodedKey;
    return this._fdbTransaction.watch(fdbKey);
  }
}
