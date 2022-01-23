import { decode, encode } from "@marubase/collator";
import {
  RangeOptions,
  ReadBucketContract,
  ReadTransactionContract,
  StorageFactory,
} from "@marubase/storage";
import { IDBPObjectStore } from "idb/with-async-ittr";

export class ReadBucket<Key, Value> implements ReadBucketContract<Key, Value> {
  public readonly factory: StorageFactory;

  public readonly name: string;

  public readonly transaction: ReadTransactionContract;

  protected _idbMutations: Promise<void>[] = [];

  protected _idbStore: IDBPObjectStore<unknown, string[], string, "readonly">;

  public constructor(
    factory: StorageFactory,
    transaction: ReadTransactionContract,
    name: string,
    idbStore: IDBPObjectStore<unknown, string[], string, "readonly">,
  ) {
    this.factory = factory;
    this.transaction = transaction;
    this.name = name;
    this._idbStore = idbStore;
  }

  public async get(key: Key, defaultValue?: Value): Promise<Value | undefined> {
    const encodedKey = encode(key);
    const idbKey = !Buffer.isBuffer(encodedKey)
      ? encodedKey.buffer
      : encodedKey;
    const idbValue = (await this._idbStore.get(idbKey)) as Buffer | undefined;
    return typeof idbValue !== "undefined"
      ? (decode(idbValue) as Value)
      : defaultValue;
  }

  public getRange(
    start: Key,
    end: Key,
    options?: RangeOptions,
  ): AsyncIterable<[Key, Value]> {
    const idbOptions = Object.assign({}, options) as Required<RangeOptions>;
    if (typeof idbOptions.limit !== "number") idbOptions.limit = Infinity;
    if (typeof idbOptions.reverse !== "boolean") idbOptions.reverse = false;

    const encodedStart = encode(start);
    const encodedEnd = encode(end);
    if (!idbOptions.reverse) {
      const idbStart = !Buffer.isBuffer(encodedStart)
        ? encodedStart.buffer
        : encodedStart;
      const idbEnd = !Buffer.isBuffer(encodedEnd)
        ? encodedEnd.buffer
        : encodedEnd;
      const idbQuery = IDBKeyRange.bound(idbStart, idbEnd, false, true);
      const idbRange = this._idbStore.iterate(idbQuery, "next");
      return this.factory.createRangeIterable(
        idbRange,
        idbOptions,
        this._idbMutations,
      );
    } else {
      const idbStart = !Buffer.isBuffer(encodedEnd)
        ? encodedEnd.buffer
        : encodedEnd;
      const idbEnd = !Buffer.isBuffer(encodedStart)
        ? encodedStart.buffer
        : encodedStart;
      const idbQuery = IDBKeyRange.bound(idbStart, idbEnd, true, false);
      const idbRange = this._idbStore.iterate(idbQuery, "prev");
      return this.factory.createRangeIterable(
        idbRange,
        idbOptions,
        this._idbMutations,
      );
    }
  }
}
