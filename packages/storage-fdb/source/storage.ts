import {
  RangeOptions,
  ReadBucketContract,
  ReadTransactionContract,
  StorageBucket,
  StorageContract,
  StorageFactory,
  TransactionFn,
  WriteBucketContract,
  WriteTransactionContract,
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
import { RangeIterable } from "./range-iterable.js";
import { ReadBucket } from "./read-bucket.js";
import { ReadTransaction } from "./read-transaction.js";
import { WriteBucket } from "./write-bucket.js";
import { WriteTransaction } from "./write-transaction.js";

export class Storage implements StorageContract {
  public static async open(
    clusterFile?: string,
    options?: DatabaseOptions,
    factory = DefaultStorageFactory,
  ): Promise<Storage> {
    setAPIVersion(620);
    const fdbDatabase = open(clusterFile, options);
    return new Storage(factory, fdbDatabase);
  }

  protected _factory: StorageFactory;

  protected _fdbDatabase: Database;

  protected _fdbDirectories: Record<string, Directory> = {};

  public constructor(factory: StorageFactory, fdbDatabase: Database) {
    this._factory = factory;
    this._fdbDatabase = fdbDatabase;
  }

  public bucket(name: string): StorageBucket {
    return {
      clear: (key: unknown) =>
        this.write(name, async (transaction) => {
          return transaction.bucket(name).clear(key);
        }),

      clearRange: (start: unknown, end: unknown) =>
        this.write(name, async (transaction) => {
          return transaction.bucket(name).clearRange(start, end);
        }),

      get: (key: unknown) =>
        this.read(name, async (transaction) => {
          return transaction.bucket(name).get(key);
        }),

      getRange: (start: unknown, end: unknown, options?: RangeOptions) =>
        this.read(name, async (transaction) => {
          const collection: [unknown, unknown][] = [];
          for await (const entry of transaction
            .bucket(name)
            .getRange(start, end, options))
            collection.push(entry);
          return collection;
        }),

      set: (key: unknown, value: unknown) =>
        this.write(name, async (transaction) => {
          return transaction.bucket(name).set(key, value);
        }),
    };
  }

  public async close(): Promise<void> {
    this._fdbDatabase.close();
  }

  public async read<Result>(
    scope: string | string[],
    transactionFn: TransactionFn<ReadTransactionContract, Result>,
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
      const transaction = this._factory.createReadTransaction(
        this._factory,
        this,
        scope as string[],
        fdbTransaction,
      );
      return transactionFn(transaction);
    });
  }

  public async write<Result>(
    scope: string | string[],
    transactionFn: TransactionFn<WriteTransactionContract, Result>,
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
      const transaction = this._factory.createWriteTransaction(
        this._factory,
        this,
        scope as string[],
        fdbTransaction,
      );
      return transactionFn(transaction);
    });
  }
}

export const DefaultStorageFactory = {
  createRangeIterable(
    fdbRange: AsyncGenerator<[Buffer, Buffer]>,
  ): AsyncIterable<[unknown, unknown]> {
    return new RangeIterable(fdbRange);
  },

  createReadBucket(
    factory: StorageFactory,
    transaction: ReadTransactionContract,
    name: string,
    fdbTransaction: Transaction,
  ): ReadBucketContract {
    return new ReadBucket(factory, transaction, name, fdbTransaction);
  },

  createReadTransaction(
    factory: StorageFactory,
    storage: StorageContract,
    scope: string[],
    fdbTransaction: Transaction,
    fdbDirectories: Record<string, Directory>,
  ): ReadTransactionContract {
    return new ReadTransaction(
      factory,
      storage,
      scope,
      fdbTransaction,
      fdbDirectories,
    );
  },

  createWriteBucket(
    factory: StorageFactory,
    transaction: WriteTransactionContract,
    name: string,
    fdbTransaction: Transaction,
  ): WriteBucketContract {
    return new WriteBucket(factory, transaction, name, fdbTransaction);
  },

  createWriteTransaction(
    factory: StorageFactory,
    storage: StorageContract,
    scope: string[],
    fdbTransaction: Transaction,
    fdbDirectories: Record<string, Directory>,
  ): WriteTransactionContract {
    return new WriteTransaction(
      factory,
      storage,
      scope,
      fdbTransaction,
      fdbDirectories,
    );
  },
} as StorageFactory;
