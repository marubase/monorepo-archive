import {
  ReadTransactionContract,
  StorageContract,
  StorageFactory,
  TransactionFn,
  WriteBucketContract,
  WriteTransactionContract,
} from "@marubase/storage-adapter";
import { ReadBucketContract } from "@marubase/storage-adapter/source";
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
    return new Storage(fdbDatabase, factory);
  }

  protected _factory: StorageFactory;

  protected _fdbDatabase: Database;

  protected _fdbDirectories: Record<string, Directory> = {};

  public constructor(fdbDatabase: Database, factory: StorageFactory) {
    this._factory = factory;
    this._fdbDatabase = fdbDatabase;
  }

  public async close(): Promise<void> {
    this._fdbDatabase.close();
  }

  public async read<Result>(
    bucketNames: string[],
    transactionFn: TransactionFn<ReadTransactionContract, Result>,
  ): Promise<Result> {
    const fdbDirectories: Record<string, Directory> = {};
    for (const bucketName of bucketNames) {
      if (!(bucketName in this._fdbDirectories)) {
        this._fdbDirectories[bucketName] = await directory.createOrOpen(
          this._fdbDatabase,
          bucketName,
        );
      }
      fdbDirectories[bucketName] = this._fdbDirectories[bucketName];
    }
    return this._fdbDatabase.doTransaction<Result>(async (fdbTransaction) => {
      const transaction = this._factory.createReadTransaction(
        fdbTransaction.snapshot(),
        fdbDirectories,
        this._factory,
      );
      return transactionFn(transaction);
    });
  }

  public async write<Result>(
    bucketNames: string[],
    transactionFn: TransactionFn<WriteTransactionContract, Result>,
  ): Promise<Result> {
    const fdbDirectories: Record<string, Directory> = {};
    for (const bucketName of bucketNames) {
      if (!(bucketName in this._fdbDirectories)) {
        this._fdbDirectories[bucketName] = await directory.createOrOpen(
          this._fdbDatabase,
          bucketName,
        );
      }
      fdbDirectories[bucketName] = this._fdbDirectories[bucketName];
    }
    return this._fdbDatabase.doTransaction<Result>(async (fdbTransaction) => {
      const transaction = this._factory.createWriteTransaction(
        fdbTransaction,
        fdbDirectories,
        this._factory,
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
    fdbTransaction: Transaction,
    factory: StorageFactory,
  ): ReadBucketContract {
    return new ReadBucket(fdbTransaction, factory);
  },
  createReadTransaction(
    fdbTransaction: Transaction,
    fdbDirectories: Record<string, Directory>,
    factory: StorageFactory,
  ): ReadTransactionContract {
    return new ReadTransaction(fdbTransaction, fdbDirectories, factory);
  },
  createWriteBucket(
    fdbTransaction: Transaction,
    factory: StorageFactory,
  ): WriteBucketContract {
    return new WriteBucket(fdbTransaction, factory);
  },
  createWriteTransaction(
    fdbTransaction: Transaction,
    fdbdirectories: Record<string, Directory>,
    factory: StorageFactory,
  ): WriteTransactionContract {
    return new WriteTransaction(fdbTransaction, fdbdirectories, factory);
  },
} as StorageFactory;
