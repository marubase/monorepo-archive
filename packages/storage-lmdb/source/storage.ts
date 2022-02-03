import {
  RangeOptions,
  ReadBucketContract,
  ReadTransactionContract,
  StorageBucket,
  StorageContract,
  StorageFactory,
  TransactionFn,
  TransactionOrder,
  versionstamp,
  WatcherFn,
  WatchWithValue,
  WriteBucketContract,
  WriteTransactionContract,
} from "@marubase/storage";
import { TransactionCast } from "@marubase/storage/source";
import { ArrayLikeIterable, Database, open, RootDatabaseOptions } from "lmdb";
import { RangeIterable } from "./range-iterable.js";
import { ReadBucket } from "./read-bucket.js";
import { ReadTransaction } from "./read-transaction.js";
import { cast } from "./transaction-cast.js";
import { order } from "./transaction-order.js";
import { WriteBucket } from "./write-bucket.js";
import { WriteTransaction } from "./write-transaction.js";

export const FIXED_OPTIONS: RootDatabaseOptions = {
  encoding: "binary",
  keyEncoding: "binary",
};

export class Storage implements StorageContract {
  public static async open(
    path: string,
    options?: RootDatabaseOptions,
    factory = DefaultStorageFactory,
  ): Promise<Storage> {
    const lmdbOptions = Object.assign({}, options, FIXED_OPTIONS);
    const lmdbDatabase = open<Buffer, Buffer>(path, lmdbOptions);
    return new Storage(factory, lmdbDatabase);
  }

  public readonly cast: TransactionCast = cast;

  public readonly factory: StorageFactory;

  public readonly order: TransactionOrder = order;

  public readonly versionstamp: typeof versionstamp = versionstamp;

  protected _lmdbDatabase: Database<Buffer, Buffer>;

  public constructor(
    factory: StorageFactory,
    lmdbDatabase: Database<Buffer, Buffer>,
  ) {
    this.factory = factory;
    this._lmdbDatabase = lmdbDatabase;
  }

  public bucket<Key, Value>(name: string): StorageBucket<Key, Value> {
    return {
      clear: (key: Key) =>
        this.write(name, async (transaction) => {
          return transaction.bucket<Key, Value>(name).clear(key);
        }),

      clearAndWatch: (key: Key) =>
        this.write(name, async (transaction) => {
          transaction.bucket(name).clear(key);
          return transaction.bucket(name).watch(key);
        }),

      clearRange: (start: Key, end: Key) =>
        this.write(name, async (transaction) => {
          return transaction.bucket<Key, Value>(name).clearRange(start, end);
        }),

      get: (key: Key, defaultValue?: Value) =>
        this.read(name, async (transaction) => {
          return transaction.bucket<Key, Value>(name).get(key, defaultValue);
        }),

      getAndWatch: async (key: Key) => {
        const [watch, value] = await this.read(name, async (transaction) => {
          const value = await transaction.bucket<Key, Value>(name).get(key);
          const watch = transaction.bucket<Key, Value>(name).watch(key);
          return [watch, value];
        });
        const watchWithValue: WatchWithValue<Value> = {
          cancel: watch.cancel.bind(watch),
          promise: watch.promise.then((changed) => {
            if (!changed) return false;
            return this.bucket<Key, Value>(name)
              .get(key)
              .then((value) => (watchWithValue.value = value))
              .then(() => Promise.resolve(true));
          }),
          value,
        };
        return watchWithValue;
      },

      getBinary: (key: Key) =>
        this.read(name, async (transaction) => {
          return transaction.bucket(name).getBinary(key);
        }),

      getRange: (start: Key, end: Key, options?: RangeOptions) =>
        this.read(name, async (transaction) => {
          const collection: [Key, Value][] = [];
          for await (const entry of transaction
            .bucket<Key, Value>(name)
            .getRange(start, end, options))
            collection.push(entry);
          return collection;
        }),

      set: (key: Key, value: Value) =>
        this.write(name, async (transaction) => {
          return transaction.bucket<Key, Value>(name).set(key, value);
        }),

      setAndWatch: (key: Key, value: Value) =>
        this.write(name, async (transaction) => {
          transaction.bucket(name).set(key, value);
          return transaction.bucket(name).watch(key);
        }),
    };
  }

  public async close(): Promise<void> {
    await this._lmdbDatabase.close();
  }

  public async read<Result>(
    scope: string | string[],
    transactionFn: TransactionFn<ReadTransactionContract, Result>,
  ): Promise<Result> {
    if (!Array.isArray(scope)) scope = [scope];
    return this._lmdbDatabase.childTransaction(async (): Promise<Result> => {
      const transaction = this.factory.createReadTransaction(
        this.factory,
        this,
        scope as string[],
        this._lmdbDatabase,
      );
      const result = await transactionFn(transaction);

      const toWatchFnPromise = (watcherFn: WatcherFn): Promise<void> =>
        watcherFn(this);
      const watchFnPromise = transaction.watchers?.map(
        toWatchFnPromise,
      ) as Promise<void>[];
      await Promise.all(watchFnPromise);

      return result;
    });
  }

  public async write<Result>(
    scope: string | string[],
    transactionFn: TransactionFn<WriteTransactionContract, Result>,
  ): Promise<Result> {
    if (!Array.isArray(scope)) scope = [scope];
    return this._lmdbDatabase.childTransaction(async (): Promise<Result> => {
      const transaction = this.factory.createWriteTransaction(
        this.factory,
        this,
        scope as string[],
        this._lmdbDatabase,
      );
      const result = await transactionFn(transaction);

      const toWatchFnPromise = (watcherFn: WatcherFn): Promise<void> =>
        watcherFn(this);
      const watchFnPromise = transaction.watchers?.map(
        toWatchFnPromise,
      ) as Promise<void>[];
      await Promise.all(watchFnPromise);

      return result;
    });
  }
}

export const DefaultStorageFactory = {
  createRangeIterable<Key, Value>(
    lmdbRange: ArrayLikeIterable<{ key: Buffer; value: Buffer }>,
  ): AsyncIterable<[Key, Value]> {
    return new RangeIterable(lmdbRange);
  },

  createReadBucket<Key, Value>(
    factory: StorageFactory,
    transaction: ReadTransactionContract,
    name: string,
    lmdbDatabase: Database<Buffer, Buffer>,
  ): ReadBucketContract<Key, Value> {
    return new ReadBucket(factory, transaction, name, lmdbDatabase);
  },

  createReadTransaction(
    factory: StorageFactory,
    storage: StorageContract,
    scope: string[],
    lmdbDatabase: Database<Buffer, Buffer>,
  ): ReadTransactionContract {
    return new ReadTransaction(factory, storage, scope, lmdbDatabase);
  },

  createWriteBucket<Key, Value>(
    factory: StorageFactory,
    transaction: WriteTransactionContract,
    name: string,
    lmdbDatabase: Database<Buffer, Buffer>,
  ): WriteBucketContract<Key, Value> {
    return new WriteBucket(factory, transaction, name, lmdbDatabase);
  },

  createWriteTransaction(
    factory: StorageFactory,
    storage: StorageContract,
    scope: string[],
    lmdbDatabase: Database<Buffer, Buffer>,
  ): WriteTransactionContract {
    return new WriteTransaction(factory, storage, scope, lmdbDatabase);
  },
} as StorageFactory;
