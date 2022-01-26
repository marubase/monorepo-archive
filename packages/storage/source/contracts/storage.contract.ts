import { versionstamp } from "@marubase/collator";
import {
  RangeOptions,
  ReadBucketContract,
  Watch,
  WatchWithValue,
} from "./read-bucket.js";
import { ReadTransactionContract } from "./read-transaction.js";
import { TransactionCast } from "./transaction-cast.js";
import { TransactionOrder } from "./transaction-order.js";
import { WriteBucketContract } from "./write-bucket.js";
import { WriteTransactionContract } from "./write-transaction.js";

export interface StorageContract {
  readonly cast: TransactionCast;

  readonly factory: StorageFactory;

  readonly order: TransactionOrder;

  readonly versionstamp: typeof versionstamp;

  bucket<Key, Value>(name: string): StorageBucket<Key, Value>;

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

export type StorageBucket<Key, Value> = {
  clear(key: Key): Promise<void>;

  clearAndWatch(key: Key): Promise<Watch>;

  clearRange(start: Key, end: Key): Promise<void>;

  get(key: Key, defaultValue?: Value): Promise<Value | undefined>;

  getAndWatch(key: Key): Promise<WatchWithValue<Value>>;

  getBinary(key: Key): Promise<Buffer | undefined>;

  getRange(
    start: Key,
    end: Key,
    options?: RangeOptions,
  ): Promise<[Key, Value][]>;

  set(key: Key, value: Value): Promise<void>;

  setAndWatch(key: Key, value: Value): Promise<Watch>;
};

export type StorageFactory = {
  createBatchRangeIterable?<Key, Value>(
    ...args: unknown[]
  ): AsyncIterable<[Key, Value]>;

  createRangeIterable<Key, Value>(
    ...args: unknown[]
  ): AsyncIterable<[Key, Value]>;

  createReadBucket<Key, Value>(
    factory: StorageFactory,
    transaction: ReadTransactionContract,
    name: string,
    ...args: unknown[]
  ): ReadBucketContract<Key, Value>;

  createReadTransaction(
    factory: StorageFactory,
    storage: StorageContract,
    scope: string[],
    ...args: unknown[]
  ): ReadTransactionContract;

  createWriteBucket<Key, Value>(
    factory: StorageFactory,
    transaction: WriteTransactionContract,
    name: string,
    ...args: unknown[]
  ): WriteBucketContract<Key, Value>;

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
