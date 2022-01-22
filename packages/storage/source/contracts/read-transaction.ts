import { ReadBucketContract } from "./read-bucket.js";
import { StorageContract, StorageFactory } from "./storage.contract.js";
import { TransactionCast } from "./transaction-cast.js";
import { TransactionOrder } from "./transaction-order.js";

export interface ReadTransactionContract {
  readonly cast: TransactionCast;

  readonly factory: StorageFactory;

  readonly order: TransactionOrder;

  readonly scope: string[];

  readonly storage: StorageContract;

  bucket<Key, Value>(name: string): ReadBucketContract<Key, Value>;
}
