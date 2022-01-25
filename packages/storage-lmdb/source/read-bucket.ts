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
import { Database, RangeOptions as LMDBRangeOptions } from "lmdb";

export class ReadBucket<Key, Value> implements ReadBucketContract<Key, Value> {
  public readonly factory: StorageFactory;

  public readonly name: string;

  public readonly transaction: ReadTransactionContract;

  public readonly watchers: WatcherFn[] = [];

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
          if (Buffer.isBuffer(value) && Buffer.isBuffer(_value))
            if (value.compare(_value) !== 0) return true;
          if (value !== _value) return true;
        }
        return false;
      };
      poll().then(_resolve).catch(_reject);
    };

    this.watchers.push(watcherFn);
    return { cancel, promise };
  }
}
