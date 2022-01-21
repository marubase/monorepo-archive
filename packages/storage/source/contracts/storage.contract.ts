import { RangeOptions, ReadBucketContract } from "./read-bucket.js";
import { ReadTransactionContract } from "./read-transaction.js";
import { WriteBucketContract } from "./write-bucket.js";
import { WriteTransactionContract } from "./write-transaction.js";

export interface StorageContract {
  bucket(name: string): StorageBucket;

  close(): Promise<void>;

  read<Result>(
    scope: string | string[],
    transactionFn: TransactionFn<ReadTransactionContract, Result>,
  ): Promise<Result>;

  write<Result>(
    scope: string | string[],
    transactionFn: TransactionFn<WriteTransactionContract, Result>,
  ): Promise<Result>;
}

export type StorageBucket = {
  clear(key: unknown): Promise<void>;

  clearRange(start: unknown, end: unknown): Promise<void>;

  get(key: unknown): Promise<unknown>;

  getRange(
    start: unknown,
    end: unknown,
    options?: RangeOptions,
  ): Promise<[unknown, unknown][]>;

  set(key: unknown, value: unknown): Promise<void>;
};

export type StorageFactory = {
  createRangeIterable(...args: unknown[]): AsyncIterable<[unknown, unknown]>;

  createReadBucket(
    factory: StorageFactory,
    transaction: ReadTransactionContract,
    name: string,
    ...args: unknown[]
  ): ReadBucketContract;

  createReadTransaction(
    factory: StorageFactory,
    storage: StorageContract,
    scope: string[],
    ...args: unknown[]
  ): ReadTransactionContract;

  createWriteBucket(
    factory: StorageFactory,
    transaction: WriteTransactionContract,
    name: string,
    ...args: unknown[]
  ): WriteBucketContract;

  createWriteTransaction(
    factory: StorageFactory,
    storage: StorageContract,
    scope: string[],
    ...args: unknown[]
  ): WriteTransactionContract;
};

export type TransactionFn<Transaction, Result> = (
  transaction: Transaction,
) => Promise<Result>;
