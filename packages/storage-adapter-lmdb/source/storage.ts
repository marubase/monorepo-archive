import {
  ReadBucketContract,
  ReadTransactionContract,
  StorageContract,
  StorageFactory,
  TransactionFn,
  WriteBucketContract,
  WriteTransactionContract,
} from "@marubase/storage-adapter";
import { ArrayLikeIterable, Database, open, RootDatabaseOptions } from "lmdb";
import { RangeIterable } from "./range-iterable.js";
import { ReadBucket } from "./read-bucket.js";
import { ReadTransaction } from "./read-transaction.js";
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
    const lmdbOptions: RootDatabaseOptions = Object.assign(
      {},
      options,
      FIXED_OPTIONS,
    );
    const lmdbDatabase = open<Buffer, Buffer>(path, lmdbOptions);
    return new Storage(lmdbDatabase, factory);
  }

  protected _factory: StorageFactory;

  protected _lmdbDatabase: Database<Buffer, Buffer>;

  public constructor(
    lmdbDatabase: Database<Buffer, Buffer>,
    factory: StorageFactory,
  ) {
    this._lmdbDatabase = lmdbDatabase;
    this._factory = factory;
  }

  public async close(): Promise<void> {
    await this._lmdbDatabase.close();
  }

  public async read<Result>(
    bucketNames: string | string[],
    transactionFn: TransactionFn<ReadTransactionContract, Result>,
  ): Promise<Result> {
    if (!Array.isArray(bucketNames)) bucketNames = [bucketNames] as string[];
    return this._lmdbDatabase.childTransaction((): Promise<Result> => {
      const transaction = this._factory.createReadTransaction(
        this._lmdbDatabase,
        bucketNames,
        this._factory,
      );
      return transactionFn(transaction);
    });
  }

  public async write<Result>(
    bucketNames: string | string[],
    transactionFn: TransactionFn<WriteTransactionContract, Result>,
  ): Promise<Result> {
    if (!Array.isArray(bucketNames)) bucketNames = [bucketNames] as string[];
    return this._lmdbDatabase.childTransaction((): Promise<Result> => {
      const transaction = this._factory.createWriteTransaction(
        this._lmdbDatabase,
        bucketNames,
        this._factory,
      );
      return transactionFn(transaction);
    });
  }
}

export const DefaultStorageFactory = {
  createRangeIterable(
    lmdbRange: ArrayLikeIterable<{ key: Buffer; value: Buffer }>,
  ): AsyncIterable<[unknown, unknown]> {
    return new RangeIterable(lmdbRange);
  },
  createReadBucket(
    lmdbDatabase: Database<Buffer, Buffer>,
    bucketName: string,
    factory: StorageFactory,
  ): ReadBucketContract {
    return new ReadBucket(lmdbDatabase, bucketName, factory);
  },
  createReadTransaction(
    lmdbDatabase: Database<Buffer, Buffer>,
    bucketNames: string[],
    factory: StorageFactory,
  ): ReadTransactionContract {
    return new ReadTransaction(lmdbDatabase, bucketNames, factory);
  },
  createWriteBucket(
    lmdbDatabase: Database<Buffer, Buffer>,
    bucketName: string,
    factory: StorageFactory,
    versionstampFn: () => Buffer,
  ): WriteBucketContract {
    return new WriteBucket(lmdbDatabase, bucketName, factory, versionstampFn);
  },
  createWriteTransaction(
    lmdbDatabase: Database<Buffer, Buffer>,
    bucketNames: string[],
    factory: StorageFactory,
  ): WriteTransactionContract {
    return new WriteTransaction(lmdbDatabase, bucketNames, factory);
  },
} as StorageFactory;
