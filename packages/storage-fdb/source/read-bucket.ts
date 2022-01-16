import { decode, encode } from "@marubase/collator";
import { keySelector, Transaction } from "foundationdb";
import { RangeIterable } from "./range-iterable.js";

export class ReadBucket {
  protected _fdbTransaction: Transaction;

  public constructor(fdbTransaction: Transaction) {
    this._fdbTransaction = fdbTransaction;
  }

  public async get(key: unknown): Promise<unknown> {
    const encodedKey = encode(key);
    const fdbKey = !Buffer.isBuffer(encodedKey)
      ? encodedKey.buffer
      : encodedKey;
    const fdbValue = await this._fdbTransaction.get(fdbKey);
    return typeof fdbValue !== "undefined" ? decode(fdbValue) : undefined;
  }

  public getRange(
    start: unknown,
    end: unknown,
    options?: RangeOptions,
  ): AsyncIterable<[unknown, unknown]> {
    const fdbOptions = Object.assign({}, options) as Required<RangeOptions>;
    if (typeof fdbOptions.limit !== "number") fdbOptions.limit = Infinity;
    if (typeof fdbOptions.reverse !== "boolean") fdbOptions.reverse = false;

    const encodedStart = !fdbOptions.reverse ? encode(start) : encode(end);
    const fdbStart = !Buffer.isBuffer(encodedStart)
      ? encodedStart.buffer
      : encodedStart;

    const encodedEnd = !fdbOptions.reverse ? encode(end) : encode(start);
    const fdbEnd = !Buffer.isBuffer(encodedEnd)
      ? encodedEnd.buffer
      : encodedEnd;

    const fdbRange = this._fdbTransaction.getRange(
      fdbOptions.reverse ? keySelector.firstGreaterThan(fdbStart) : fdbStart,
      fdbOptions.reverse ? keySelector.firstGreaterThan(fdbEnd) : fdbEnd,
      fdbOptions,
    );
    return new RangeIterable(fdbRange);
  }

  public watch(key: unknown): Watch {
    const encodedKey = encode(key);
    const fdbKey = !Buffer.isBuffer(encodedKey)
      ? encodedKey.buffer
      : encodedKey;
    return this._fdbTransaction.watch(fdbKey);
  }
}

export type RangeOptions = {
  limit?: number;
  reverse?: boolean;
};

export type Watch = {
  readonly promise: Promise<boolean>;
  cancel(): void;
};
