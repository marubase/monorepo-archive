import { decode, encode } from "@marubase/collator";
import {
  RangeOptions,
  StorageError,
  StorageFactory,
  WriteBucketContract,
  WriteTransactionContract,
} from "@marubase/storage";
import { keySelector, Transaction } from "foundationdb";

export class WriteBucket<Key, Value>
  implements WriteBucketContract<Key, Value>
{
  public readonly factory: StorageFactory;

  public readonly name: string;

  public readonly transaction: WriteTransactionContract;

  protected _fdbTransaction: Transaction;

  public constructor(
    factory: StorageFactory,
    transaction: WriteTransactionContract,
    name: string,
    fdbTransaction: Transaction,
  ) {
    this.factory = factory;
    this.transaction = transaction;
    this.name = name;
    this._fdbTransaction = fdbTransaction;
  }

  public clear(key: Key): void {
    const encodedKey = encode(key);
    const fdbKey = !Buffer.isBuffer(encodedKey)
      ? encodedKey.buffer
      : encodedKey;
    this._fdbTransaction.clear(fdbKey);
  }

  public clearRange(start: Key, end: Key): void {
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

  public async get(key: Key, defaultValue?: Value): Promise<Value | undefined> {
    const encodedKey = encode(key);
    const fdbKey = !Buffer.isBuffer(encodedKey)
      ? encodedKey.buffer
      : encodedKey;
    const fdbValue = await this._fdbTransaction.get(fdbKey);
    return typeof fdbValue !== "undefined"
      ? (decode(fdbValue) as Value)
      : defaultValue;
  }

  public getRange(
    start: Key,
    end: Key,
    options?: RangeOptions,
  ): AsyncIterable<[Key, Value]> {
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
      return this.factory.createRangeIterable<Key, Value>(fdbRange);
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
      return this.factory.createRangeIterable<Key, Value>(fdbRange);
    }
  }

  public set(key: Key, value: Value): void {
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
