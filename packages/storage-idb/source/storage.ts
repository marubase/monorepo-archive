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
    const idbDatabase = await openDB(name, undefined, {
      upgrade(database) {
        database.createObjectStore("_meta");
        database.createObjectStore("test");
      },
    });
    return new Storage(DefaultStorageFactory, idbDatabase);
  }
  public readonly cast: TransactionCast = cast;

  public readonly factory: StorageFactory;

  public readonly order: TransactionOrder = order;

  public readonly versionstamp: typeof versionstamp = versionstamp;

  protected _idbDatabase: IDBPDatabase;

  public constructor(factory: StorageFactory, idbDatabase: IDBPDatabase) {
    this.factory = factory;
    this._idbDatabase = idbDatabase;
  }

  public bucket<Key, Value>(name: string): StorageBucket<Key, Value> {
    return {
      clear: (key: Key) =>
        this.write(name, async (transaction) => {
          return transaction.bucket<Key, Value>(name).clear(key);
        }),

      clearRange: (start: Key, end: Key) =>
        this.write(name, async (transaction) => {
          return transaction.bucket<Key, Value>(name).clearRange(start, end);
        }),

      get: (key: Key, defaultValue?: Value) =>
        this.read(name, async (transaction) => {
          return transaction.bucket<Key, Value>(name).get(key, defaultValue);
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
    };
  }

  public async close(): Promise<void> {
    this._idbDatabase.close();
  }

  public async read<Result>(
    scope: string | string[],
    transactionFn: TransactionFn<ReadTransactionContract, Result>,
  ): Promise<Result> {
    if (!Array.isArray(scope)) scope = [scope];
    const idbTransaction = this._idbDatabase.transaction(scope, "readonly");
    const transaction = this.factory.createReadTransaction(
      this.factory,
      this,
      scope as string[],
      idbTransaction,
    );
    const result = await transactionFn(transaction);
    await idbTransaction.done;
    return result;
  }

  public async write<Result>(
    scope: string | string[],
    transactionFn: TransactionFn<WriteTransactionContract, Result>,
  ): Promise<Result> {
    if (!Array.isArray(scope)) scope = [scope];
    const idbTransaction = this._idbDatabase.transaction(
      scope.concat("_meta"),
      "readwrite",
    );
    const transaction = this.factory.createWriteTransaction(
      this.factory,
      this,
      scope as string[],
      idbTransaction,
    );
    const result = await transactionFn(transaction);
    await idbTransaction.done;
    return result;
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
