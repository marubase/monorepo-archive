import { versionstamp } from "@marubase/collator";
import {
  RangeOptions,
  ReadBucketInterface,
  Watch,
  WatchWithValue,
} from "./read-bucket.contract.js";
import { ReadTransactionInterface } from "./read-transaction.contract.js";
import { TransactionCast } from "./transaction-cast.contract.js";
import { TransactionOrder } from "./transaction-order.contract.js";
import { WriteBucketInterface } from "./write-bucket.contract.js";
import { WriteTransactionInterface } from "./write-transaction.contract.js";

export const StorageContract = Symbol("StorageContract");

export interface StorageInterface {
  readonly cast: TransactionCast;

  readonly factory: StorageFactory;

  readonly order: TransactionOrder;

  readonly versionstamp: typeof versionstamp;

  bucket<Key, Value>(name: string): StorageBucket<Key, Value>;

  close(): Promise<void>;

  read<Result>(
    scope: string | string[],
    transactionFn: TransactionFn<ReadTransactionInterface, Result>,
  ): Promise<Result>;

  write<Result>(
    scope: string | string[],
    transactionFn: TransactionFn<WriteTransactionInterface, Result>,
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
    transaction: ReadTransactionInterface,
    name: string,
    ...args: unknown[]
  ): ReadBucketInterface<Key, Value>;

  createReadTransaction(
    factory: StorageFactory,
    storage: StorageInterface,
    scope: string[],
    ...args: unknown[]
  ): ReadTransactionInterface;

  createWriteBucket<Key, Value>(
    factory: StorageFactory,
    transaction: WriteTransactionInterface,
    name: string,
    ...args: unknown[]
  ): WriteBucketInterface<Key, Value>;

  createWriteTransaction(
    factory: StorageFactory,
    storage: StorageInterface,
    scope: string[],
    ...args: unknown[]
  ): WriteTransactionInterface;
};

export type TransactionFn<Transaction, Result> = (
  transaction: Transaction,
) => Promise<Result>;
