import {
  Database,
  DatabaseOptions,
  Directory,
  directory,
  open,
  setAPIVersion,
} from "foundationdb";
import { ReadTransaction } from "./read-transaction.js";
import { WriteTransaction } from "./write-transaction.js";

setAPIVersion(620);

export class Storage {
  public static async open(
    clusterFile?: string,
    options?: DatabaseOptions,
  ): Promise<Storage> {
    const fdbDatabase = open(clusterFile, options);
    return new Storage(fdbDatabase);
  }

  protected _fdbBuckets: Record<string, Directory> = {};

  protected _fdbDatabase: Database;

  public constructor(fdbDatabase: Database) {
    this._fdbDatabase = fdbDatabase;
  }

  public get buckets(): Promise<string[]> {
    const toString = (bucketName: Buffer): string =>
      bucketName.toString("utf8");
    return directory
      .listAll(this._fdbDatabase)
      .then((bucketNames) => bucketNames.map(toString));
  }

  public async close(): Promise<void> {
    this._fdbDatabase.close();
  }

  public async createBucket(bucketName: string): Promise<void> {
    const bucket = await directory.createOrOpen(this._fdbDatabase, bucketName);
    this._fdbBuckets[bucketName] = bucket;
  }

  public async deleteBucket(bucketName: string): Promise<void> {
    await directory.removeIfExists(this._fdbDatabase, bucketName);
    delete this._fdbBuckets[bucketName];
  }

  public async read<Result>(
    bucketNames: string[],
    transactionFn: TransactionFn<ReadTransaction, Result>,
  ): Promise<Result> {
    return this._fdbDatabase.doTransaction(async (fdbTransaction) => {
      const fdbBuckets: Record<string, Directory> = {};
      for (const bucketName of bucketNames) {
        if (!(bucketName in this._fdbBuckets))
          this._fdbBuckets[bucketName] = await directory.createOrOpen(
            fdbTransaction,
            bucketName,
          );
        fdbBuckets[bucketName] = this._fdbBuckets[bucketName];
      }
      const transaction = new ReadTransaction(fdbBuckets, fdbTransaction);
      return transactionFn(transaction);
    });
  }

  public async write<Result>(
    bucketNames: string[],
    transactionFn: TransactionFn<WriteTransaction, Result>,
  ): Promise<Result> {
    return this._fdbDatabase.doTransaction(async (fdbTransaction) => {
      const fdbBuckets: Record<string, Directory> = {};
      for (const bucketName of bucketNames) {
        if (!(bucketName in this._fdbBuckets))
          this._fdbBuckets[bucketName] = await directory.createOrOpen(
            fdbTransaction,
            bucketName,
          );
        fdbBuckets[bucketName] = this._fdbBuckets[bucketName];
      }
      const transaction = new WriteTransaction(fdbBuckets, fdbTransaction);
      return transactionFn(transaction);
    });
  }
}

export type TransactionFn<Transaction, Result> = (
  transaction: Transaction,
) => Promise<Result>;
