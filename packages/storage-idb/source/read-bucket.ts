import { decode, encode } from "@marubase/collator";
import {
  RangeOptions,
  ReadBucketContract,
  ReadTransactionContract,
  StorageContract,
  StorageFactory,
  Watch,
  WatcherFn,
} from "@marubase/storage";
import { IDBPObjectStore } from "idb/with-async-ittr";

export class ReadBucket<Key, Value> implements ReadBucketContract<Key, Value> {
  public readonly factory: StorageFactory;

  public readonly mutations: Promise<void>[] = [];

  public readonly name: string;

  public readonly transaction: ReadTransactionContract;

  public readonly watchers: WatcherFn[] = [];

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
    if (typeof idbOptions.limit !== "number") idbOptions.limit = 1000;
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

  public watch(key: Key): Watch {
    let _cancelled = false;
    const cancel = (): void => {
      _cancelled = true;
    };

    let _resolve: (value: PromiseLike<boolean> | boolean) => void;
    let _reject: (reason?: unknown) => void;
    const promise = new Promise<boolean>((resolve, reject) => {
      _resolve = resolve;
      _reject = reject;
    });

    let _value: Value | undefined;
    const watcherFn = async (storage: StorageContract): Promise<void> => {
      _value = await this.get(key);
      setTimeout(() => watcherPoll(storage), 16);
    };

    const watcherPoll = (storage: StorageContract): void => {
      const poll = async (): Promise<boolean> => {
        while (!_cancelled) {
          await new Promise((resolve) => setTimeout(resolve, 16));
          const value = await storage.bucket<Key, Value>(this.name).get(key);
          if (Buffer.isBuffer(value) && Buffer.isBuffer(_value)) {
            /* istanbul ignore else */
            if (value.compare(_value) !== 0) return true;
          } else {
            /* istanbul ignore else */
            if (value !== _value) return true;
          }
        }
        return false;
      };
      poll().then(_resolve).catch(_reject);
    };

    this.watchers.push(watcherFn);
    return { cancel, promise };
  }
}
