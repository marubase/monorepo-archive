import { ReadBucketInterface, WatcherFn } from "./read-bucket.contract.js";
import { StorageFactory, StorageInterface } from "./storage.contract.js";
import { TransactionCast } from "./transaction-cast.contract.js";
import { TransactionOrder } from "./transaction-order.contract.js";

export const ReadTransactionContract = Symbol("ReadTransactionContract");

export interface ReadTransactionInterface {
  readonly cast: TransactionCast;

  readonly factory: StorageFactory;

  readonly mutations?: Promise<void>[];

  readonly order: TransactionOrder;

  readonly scope: string[];

  readonly storage: StorageInterface;

  readonly watchers?: WatcherFn[];

  bucket<Key, Value>(name: string): ReadBucketInterface<Key, Value>;
}
