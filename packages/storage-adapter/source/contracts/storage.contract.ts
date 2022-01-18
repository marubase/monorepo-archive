import {
  ReadBucketContract,
  ReadTransactionContract,
  WriteBucketContract,
  WriteTransactionContract,
} from "./transaction.contract.js";

export interface StorageContract {
  buckets(): Promise<string[]>;

  close(): Promise<void>;

  createBucket(bucketName: string): Promise<void>;

  deleteBucket(bucketName: string): Promise<void>;

  read<Result>(
    bucketNames: string | string[],
    transactionFn: TransactionFn<ReadTransactionContract, Result>,
  ): Promise<Result>;

  write<Result>(
    bucketNames: string | string[],
    transactionFn: TransactionFn<WriteTransactionContract, Result>,
  ): Promise<Result>;
}

export type StorageFactory = {
  createReadBucket: (...args: unknown[]) => ReadBucketContract;
  createReadTransaction: (...args: unknown[]) => ReadTransactionContract;
  createWriteBucket: (...args: unknown[]) => WriteBucketContract;
  createWriteTransaction: (...args: unknown[]) => WriteTransactionContract;
};

export type TransactionFn<Transaction, Result> = (
  transaction: Transaction,
) => Result;
