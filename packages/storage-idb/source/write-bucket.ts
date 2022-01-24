/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { decode, encode } from "@marubase/collator";
import {
  RangeOptions,
  StorageError,
  StorageFactory,
  WriteBucketContract,
  WriteTransactionContract,
} from "@marubase/storage";
import { IDBPObjectStore } from "idb/with-async-ittr";

export class WriteBucket<Key, Value>
  implements WriteBucketContract<Key, Value>
{
  public readonly factory: StorageFactory;

  public readonly mutations: Promise<void>[] = [];

  public readonly name: string;

  public readonly transaction: WriteTransactionContract;

  protected _idbStore: IDBPObjectStore<unknown, string[], string, "readwrite">;

  public constructor(
    factory: StorageFactory,
    transaction: WriteTransactionContract,
    name: string,
    idbStore: IDBPObjectStore<unknown, string[], string, "readwrite">,
  ) {
    this.factory = factory;
    this.transaction = transaction;
    this.name = name;
    this._idbStore = idbStore;
  }

  public clear(key: Key): void {
    const encodedKey = encode(key);
    const idbKey = !Buffer.isBuffer(encodedKey)
      ? encodedKey.buffer
      : encodedKey;
    this.mutations.push(this._idbStore.delete(idbKey));
  }

  public clearRange(start: Key, end: Key): void {
    const encodedStart = encode(start);
    const idbStart = !Buffer.isBuffer(encodedStart)
      ? encodedStart.buffer
      : encodedStart;

    const encodedEnd = encode(end);
    const idbEnd = !Buffer.isBuffer(encodedEnd)
      ? encodedEnd.buffer
      : encodedEnd;

    const idbQuery = IDBKeyRange.bound(idbStart, idbEnd, false, true);
    this.mutations.push(this._idbStore.delete(idbQuery));
  }

  public async get(key: Key, defaultValue?: Value): Promise<Value | undefined> {
    await Promise.all(this.mutations);
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
        this.mutations,
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
        this.mutations,
      );
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
    this.mutations.push(
      (async (): Promise<void> => {
        if (!Buffer.isBuffer(encodedKey)) {
          const { buffer: idbKey, position } = encodedKey;
          idbKey.set(await this.transaction.commitID!(), position);
          const idbValue = encodedValue as Buffer;
          await this._idbStore.put(idbValue, idbKey);
        } else if (!Buffer.isBuffer(encodedValue)) {
          const { buffer: idbValue, position } = encodedValue;
          idbValue.set(await this.transaction.commitID!(), position);
          const idbKey = encodedKey as Buffer;
          await this._idbStore.put(idbValue, idbKey);
        } else {
          await this._idbStore.put(encodedValue, encodedKey);
        }
      })(),
    );
  }
}
