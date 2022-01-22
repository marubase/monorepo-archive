import { decode, encode } from "@marubase/collator";
import {
  RangeOptions,
  ReadBucketContract,
  ReadTransactionContract,
  StorageFactory,
} from "@marubase/storage";
import { keySelector, Transaction } from "foundationdb";

export class ReadBucket implements ReadBucketContract {
  public readonly factory: StorageFactory;

  public readonly name: string;

  public readonly transaction: ReadTransactionContract;

  protected _fdbTransaction: Transaction;

  public constructor(
    factory: StorageFactory,
    transaction: ReadTransactionContract,
    name: string,
    fdbTransaction: Transaction,
  ) {
    this.factory = factory;
    this.transaction = transaction;
    this.name = name;
    this._fdbTransaction = fdbTransaction;
  }

  public async get(key: unknown, defaultValue?: unknown): Promise<unknown> {
    const encodedKey = encode(key);
    const fdbKey = !Buffer.isBuffer(encodedKey)
      ? encodedKey.buffer
      : encodedKey;
    const fdbValue = await this._fdbTransaction.get(fdbKey);
    return typeof fdbValue !== "undefined" ? decode(fdbValue) : defaultValue;
  }

  public getRange(
    start: unknown,
    end: unknown,
    options?: RangeOptions,
  ): AsyncIterable<[unknown, unknown]> {
    const fdbOptions = Object.assign({}, options) as Required<RangeOptions>;
    if (typeof fdbOptions.limit !== "number") fdbOptions.limit = Infinity;
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
      const fdbRange = this._fdbTransaction.getRange(
        fdbStart,
        fdbEnd,
        fdbOptions,
      );
      return this.factory.createRangeIterable(fdbRange);
    } else {
      const fdbStart = !Buffer.isBuffer(encodedEnd)
        ? keySelector.firstGreaterThan(encodedEnd.buffer)
        : keySelector.firstGreaterThan(encodedEnd);
      const fdbEnd = !Buffer.isBuffer(encodedStart)
        ? keySelector.firstGreaterThan(encodedStart.buffer)
        : keySelector.firstGreaterThan(encodedStart);
      const fdbRange = this._fdbTransaction.getRange(
        fdbStart,
        fdbEnd,
        fdbOptions,
      );
      return this.factory.createRangeIterable(fdbRange);
    }
  }
}
