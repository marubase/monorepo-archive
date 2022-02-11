import {
  RangeOptions,
  ReadBucketInterface,
  ReadTransactionInterface,
  StorageBucket,
  StorageFactory,
  StorageInterface,
  TransactionCast,
  TransactionFn,
  TransactionOrder,
  versionstamp,
  WatchWithValue,
  WriteBucketInterface,
  WriteTransactionInterface,
} from "@marubase/storage";
import {
  Database,
  DatabaseOptions,
  directory,
  Directory,
  open,
  setAPIVersion,
  Transaction,
} from "foundationdb";
import { BatchRangeIterable } from "./batch-range-iterable.js";
import { ReadBucket } from "./read-bucket.js";
import { ReadTransaction } from "./read-transaction.js";
import { cast } from "./transaction-cast.js";
import { order } from "./transaction-order.js";
import { WriteBucket } from "./write-bucket.js";
import { WriteTransaction } from "./write-transaction.js";

export class Storage implements StorageInterface {
  public static async open(
    clusterFile?: string,
    options?: DatabaseOptions,
    factory = DefaultStorageFactory,
  ): Promise<Storage> {
    setAPIVersion(620);
    const fdbDatabase = open(clusterFile, options);
    return new Storage(factory, fdbDatabase);
  }

  public readonly cast: TransactionCast = cast;

  public readonly factory: StorageFactory;

  public readonly order: TransactionOrder = order;

  public readonly versionstamp: typeof versionstamp = versionstamp;

  protected _fdbDatabase: Database;

  protected _fdbDirectories: Record<string, Directory> = {};

  public constructor(factory: StorageFactory, fdbDatabase: Database) {
    this.factory = factory;
    this._fdbDatabase = fdbDatabase;
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
    this._fdbDatabase.close();
  }

  public async read<Result>(
    scope: string | string[],
    transactionFn: TransactionFn<ReadTransactionInterface, Result>,
  ): Promise<Result> {
    if (!Array.isArray(scope)) scope = [scope];

    const fdbDirectories: Record<string, Directory> = {};
    for (const name of scope) {
      if (name in this._fdbDirectories) {
        fdbDirectories[name] = this._fdbDirectories[name];
        continue;
      }
      const bucket = await directory.createOrOpen(this._fdbDatabase, name);
      this._fdbDirectories[name] = bucket;
      fdbDirectories[name] = bucket;
    }

    return this._fdbDatabase.doTransaction((fdbTransaction) => {
      const transaction = this.factory.createReadTransaction(
        this.factory,
        this,
        scope as string[],
        fdbTransaction.snapshot(),
        fdbDirectories,
      );
      return transactionFn(transaction);
    });
  }

  public async write<Result>(
    scope: string | string[],
    transactionFn: TransactionFn<WriteTransactionInterface, Result>,
  ): Promise<Result> {
    if (!Array.isArray(scope)) scope = [scope];

    const fdbDirectories: Record<string, Directory> = {};
    for (const name of scope) {
      if (name in this._fdbDirectories) {
        fdbDirectories[name] = this._fdbDirectories[name];
        continue;
      }
      const bucket = await directory.createOrOpen(this._fdbDatabase, name);
      this._fdbDirectories[name] = bucket;
      fdbDirectories[name] = bucket;
    }

    return this._fdbDatabase.doTransaction((fdbTransaction) => {
      const transaction = this.factory.createWriteTransaction(
        this.factory,
        this,
        scope as string[],
        fdbTransaction,
        fdbDirectories,
      );
      return transactionFn(transaction);
    });
  }
}

export const DefaultStorageFactory = {
  createRangeIterable<Key, Value>(
    fdbBatchRange: AsyncGenerator<[Buffer, Buffer][]>,
  ): AsyncIterable<[Key, Value]> {
    return new BatchRangeIterable(fdbBatchRange);
  },

  createReadBucket<Key, Value>(
    factory: StorageFactory,
    transaction: ReadTransactionInterface,
    name: string,
    fdbTransaction: Transaction,
  ): ReadBucketInterface<Key, Value> {
    return new ReadBucket(factory, transaction, name, fdbTransaction);
  },

  createReadTransaction(
    factory: StorageFactory,
    storage: StorageInterface,
    scope: string[],
    fdbTransaction: Transaction,
    fdbDirectories: Record<string, Directory>,
  ): ReadTransactionInterface {
    return new ReadTransaction(
      factory,
      storage,
      scope,
      fdbTransaction,
      fdbDirectories,
    );
  },

  createWriteBucket<Key, Value>(
    factory: StorageFactory,
    transaction: WriteTransactionInterface,
    name: string,
    fdbTransaction: Transaction,
  ): WriteBucketInterface<Key, Value> {
    return new WriteBucket(factory, transaction, name, fdbTransaction);
  },

  createWriteTransaction(
    factory: StorageFactory,
    storage: StorageInterface,
    scope: string[],
    fdbTransaction: Transaction,
    fdbDirectories: Record<string, Directory>,
  ): WriteTransactionInterface {
    return new WriteTransaction(
      factory,
      storage,
      scope,
      fdbTransaction,
      fdbDirectories,
    );
  },
} as StorageFactory;
