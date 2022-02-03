import {
  decode,
  encode,
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
    const lmdbValue = await this.getBinary(key);
    return typeof lmdbValue !== "undefined"
      ? (decode(lmdbValue) as Value)
      : defaultValue;
  }

  public async getBinary(key: Key): Promise<Buffer | undefined> {
    const encodedKey = encode([this.name, key]);
    const lmdbKey = !Buffer.isBuffer(encodedKey)
      ? encodedKey.buffer
      : encodedKey;
    return this._lmdbDatabase.getBinary(lmdbKey);
  }

  public getRange(
    start: Key,
    end: Key,
    options?: RangeOptions,
  ): AsyncIterable<[Key, Value]> {
    const lmdbOptions = Object.assign({}, options) as LMDBRangeOptions;
    if (typeof lmdbOptions.limit !== "number") lmdbOptions.limit = 1000;
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

    let _value: Buffer | undefined;
    const watcherFn = async (storage: StorageContract): Promise<void> => {
      _value = await this.getBinary(key);
      setTimeout(() => watcherPoll(storage), 16);
    };

    const watcherPoll = (storage: StorageContract): void => {
      const poll = async (): Promise<boolean> => {
        while (!_cancelled) {
          await new Promise((resolve) => setTimeout(resolve, 16));
          const value = await storage.bucket(this.name).getBinary(key);
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
