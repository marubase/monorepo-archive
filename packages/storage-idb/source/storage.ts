import { versionstamp } from "@marubase/collator";
import {
  RangeOptions,
  ReadBucketContract,
  ReadTransactionContract,
  StorageBucket,
  StorageContract,
  StorageFactory,
  TransactionCast,
  TransactionFn,
  TransactionOrder,
  WatcherFn,
  WatchWithValue,
  WriteBucketContract,
  WriteTransactionContract,
} from "@marubase/storage";
import {
  IDBPCursorWithValueIteratorValue,
  IDBPDatabase,
  IDBPObjectStore,
  IDBPTransaction,
  openDB,
} from "idb/with-async-ittr";
import { RangeIterable } from "./range-iterable.js";
import { ReadBucket } from "./read-bucket.js";
import { ReadTransaction } from "./read-transaction.js";
import { cast } from "./transaction-cast.js";
import { order } from "./transaction-order.js";
import { WriteBucket } from "./write-bucket.js";
import { WriteTransaction } from "./write-transaction.js";

export class Storage implements StorageContract {
  public static async open(name: string): Promise<Storage> {
    return new Storage(DefaultStorageFactory, name);
  }

  public readonly cast: TransactionCast = cast;

  public readonly factory: StorageFactory;

  public readonly order: TransactionOrder = order;

  public readonly versionstamp: typeof versionstamp = versionstamp;

  protected _idbDatabasePromise: Promise<IDBPDatabase>;

  public constructor(factory: StorageFactory, name: string) {
    this.factory = factory;
    this._idbDatabasePromise = this._openIDB(name, undefined, ["_meta"]);
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
    const idbDatabase = await this._idbDatabasePromise;
    idbDatabase.close();
  }

  public async read<Result>(
    scope: string | string[],
    transactionFn: TransactionFn<ReadTransactionContract, Result>,
  ): Promise<Result> {
    if (!Array.isArray(scope)) scope = [scope];

    let idbDatabase = await this._idbDatabasePromise;
    const inStore = (bucketName: string): boolean =>
      idbDatabase.objectStoreNames.contains(bucketName);
    if (!scope.every(inStore)) {
      idbDatabase.close();
      const { name, version } = idbDatabase;
      this._idbDatabasePromise = this._openIDB(name, version + 1, scope);
      idbDatabase = await this._idbDatabasePromise;
    }

    const idbTransaction = idbDatabase.transaction(scope, "readonly");
    const transaction = this.factory.createReadTransaction(
      this.factory,
      this,
      scope,
      idbTransaction,
    );
    const result = await transactionFn(transaction);
    await Promise.all(transaction.mutations as Promise<void>[]);

    const toWatchFnPromise = (watcherFn: WatcherFn): Promise<void> =>
      watcherFn(this);
    const watchFnPromise = transaction.watchers?.map(
      toWatchFnPromise,
    ) as Promise<void>[];
    await Promise.all(watchFnPromise);

    await idbTransaction.done;
    return result;
  }

  public async write<Result>(
    scope: string | string[],
    transactionFn: TransactionFn<WriteTransactionContract, Result>,
  ): Promise<Result> {
    if (!Array.isArray(scope)) scope = [scope];
    scope = scope.concat(["_meta"]);

    let idbDatabase = await this._idbDatabasePromise;
    const inStore = (bucketName: string): boolean =>
      idbDatabase.objectStoreNames.contains(bucketName);
    if (!scope.every(inStore)) {
      idbDatabase.close();
      const { name, version } = idbDatabase;
      this._idbDatabasePromise = this._openIDB(name, version + 1, scope);
      idbDatabase = await this._idbDatabasePromise;
    }

    const idbTransaction = idbDatabase.transaction(scope, "readwrite");
    const transaction = this.factory.createWriteTransaction(
      this.factory,
      this,
      scope,
      idbTransaction,
    );
    const result = await transactionFn(transaction);
    await Promise.all(transaction.mutations as Promise<void>[]);

    const toWatchFnPromise = (watcherFn: WatcherFn): Promise<void> =>
      watcherFn(this);
    const watchFnPromise = transaction.watchers?.map(
      toWatchFnPromise,
    ) as Promise<void>[];
    await Promise.all(watchFnPromise);

    await idbTransaction.done;
    return result;
  }

  protected _openIDB(
    name: string,
    version: number | undefined,
    scope: string[],
  ): Promise<IDBPDatabase> {
    /* istanbul ignore next */
    const closeAndOpenIDB = (idbDatabase: IDBPDatabase): void => {
      idbDatabase.close();
      this._idbDatabasePromise = this._openIDB(name, undefined, []);
    };
    this._idbDatabasePromise = openDB(name, version, {
      blocking: (): void => {
        /* istanbul ignore next */
        this._idbDatabasePromise.then(closeAndOpenIDB);
      },
      terminated: (): void => {
        /* istanbul ignore next */
        this._idbDatabasePromise.then(closeAndOpenIDB);
      },
      upgrade: (idbDatabase): void => {
        const byStore = (bucketName: string): boolean =>
          !idbDatabase.objectStoreNames.contains(bucketName);
        for (const bucketName of scope.filter(byStore))
          idbDatabase.createObjectStore(bucketName);
      },
    });
    return this._idbDatabasePromise;
  }
}

export const DefaultStorageFactory = {
  createRangeIterable<Key, Value>(
    idbRange: AsyncIterableIterator<
      IDBPCursorWithValueIteratorValue<
        unknown,
        string[],
        string,
        unknown,
        "readonly" | "readwrite"
      >
    >,
    idbOptions: Required<RangeOptions>,
    idbMutations: Promise<void>[],
  ): AsyncIterable<[Key, Value]> {
    return new RangeIterable(idbRange, idbOptions, idbMutations);
  },

  createReadBucket<Key, Value>(
    factory: StorageFactory,
    transaction: ReadTransactionContract,
    name: string,
    idbStore: IDBPObjectStore<unknown, string[], string, "readonly">,
  ): ReadBucketContract<Key, Value> {
    return new ReadBucket(factory, transaction, name, idbStore);
  },

  createReadTransaction(
    factory: StorageFactory,
    storage: StorageContract,
    scope: string[],
    idbTransaction: IDBPTransaction<unknown, string[], "readonly">,
  ): ReadTransactionContract {
    return new ReadTransaction(factory, storage, scope, idbTransaction);
  },

  createWriteBucket<Key, Value>(
    factory: StorageFactory,
    transaction: WriteTransactionContract,
    name: string,
    idbStore: IDBPObjectStore<unknown, string[], string, "readwrite">,
  ): WriteBucketContract<Key, Value> {
    return new WriteBucket(factory, transaction, name, idbStore);
  },

  createWriteTransaction(
    factory: StorageFactory,
    storage: StorageContract,
    scope: string[],
    idbTransaction: IDBPTransaction<unknown, string[], "readwrite">,
  ): WriteTransactionContract {
    return new WriteTransaction(factory, storage, scope, idbTransaction);
  },
} as StorageFactory;
