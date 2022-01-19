import {
  ReadBucketContract,
  ReadTransactionContract,
  WriteBucketContract,
  WriteTransactionContract,
} from "./transaction.contract.js";

export interface StorageContract {
  close(): Promise<void>;

  read<Result>(
    bucketNames: string[],
    transactionFn: TransactionFn<ReadTransactionContract, Result>,
  ): Promise<Result>;

  write<Result>(
    bucketNames: string[],
    transactionFn: TransactionFn<WriteTransactionContract, Result>,
  ): Promise<Result>;
}

export type StorageFactory = {
  createRangeIterable: (
    ...args: unknown[]
  ) => AsyncIterable<[unknown, unknown]>;
  createReadBucket: (...args: unknown[]) => ReadBucketContract;
  createReadTransaction: (...args: unknown[]) => ReadTransactionContract;
  createWriteBucket: (...args: unknown[]) => WriteBucketContract;
  createWriteTransaction: (...args: unknown[]) => WriteTransactionContract;
};

export type TransactionFn<Transaction, Result> = (
  transaction: Transaction,
) => Result;
