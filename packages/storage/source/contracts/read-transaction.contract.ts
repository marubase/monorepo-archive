import { ReadBucketContract, WatcherFn } from "./read-bucket.contract.js";
import { StorageContract, StorageFactory } from "./storage.contract.js";
import { TransactionCast } from "./transaction-cast.contract.js";
import { TransactionOrder } from "./transaction-order.contract.js";

export interface ReadTransactionContract {
  readonly cast: TransactionCast;

  readonly factory: StorageFactory;

  readonly mutations?: Promise<void>[];

  readonly order: TransactionOrder;

  readonly scope: string[];

  readonly storage: StorageContract;

  readonly watchers?: WatcherFn[];

  bucket<Key, Value>(name: string): ReadBucketContract<Key, Value>;
}
