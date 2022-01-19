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
    return this._fdbDatabase.doTransaction<Result>(async (fdbTransaction) => {
      const transaction = this._factory.createReadTransaction(
        fdbTransaction.snapshot(),
        bucketNames,
        this._factory,
      );
      return transactionFn(transaction);
    });
  }

  public async write<Result>(
    bucketNames: string[],
    transactionFn: TransactionFn<WriteTransactionContract, Result>,
  ): Promise<Result> {
    return this._fdbDatabase.doTransaction<Result>(async (fdbTransaction) => {
      const transaction = this._factory.createWriteTransaction(
        fdbTransaction,
        bucketNames,
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
    bucketName: string,
    factory: StorageFactory,
  ): ReadBucketContract {
    return new ReadBucket(fdbTransaction, bucketName, factory);
  },
  createReadTransaction(
    fdbTransaction: Transaction,
    bucketNames: string[],
    factory: StorageFactory,
  ): ReadTransactionContract {
    return new ReadTransaction(fdbTransaction, bucketNames, factory);
  },
  createWriteBucket(
    fdbTransaction: Transaction,
    bucketName: string,
    factory: StorageFactory,
  ): WriteBucketContract {
    return new WriteBucket(fdbTransaction, bucketName, factory);
  },
  createWriteTransaction(
    fdbTransaction: Transaction,
    bucketNames: string[],
    factory: StorageFactory,
  ): WriteTransactionContract {
    return new WriteTransaction(fdbTransaction, bucketNames, factory);
  },
} as StorageFactory;
